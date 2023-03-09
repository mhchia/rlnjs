import { hexlify } from '@ethersproject/bytes'
import { keccak256 } from '@ethersproject/solidity'
import { toUtf8Bytes } from '@ethersproject/strings'
import { MerkleProof } from '@zk-kit/incremental-merkle-tree'
import { groth16 } from 'snarkjs'
import { Fq, isProofSameExternalNullifier } from './utils'
import poseidon from 'poseidon-lite'
import { Identity } from '@semaphore-protocol/identity'

// Types
import { RLNFullProof, RLNSNARKProof, RLNWitnessT, StrBigInt, VerificationKeyT } from './types'
import { instantiateBn254, deserializeJSRLNProof, serializeJSRLNProof } from './waku'


type RLNExportedT = {
  identity: string,
  rlnIdentifier: string,
  verificationKey: string,
  wasmFilePath: string,
  finalZkeyPath: string,
}


/**
RLN is a class that represents a single RLN identity.
**/
export default class RLN {
  wasmFilePath: string

  finalZkeyPath: string

  verificationKey: VerificationKeyT

  rlnIdentifier: bigint

  identity: Identity

  commitment: bigint

  secretIdentity: bigint

  constructor(wasmFilePath: string, finalZkeyPath: string, verificationKey: VerificationKeyT, rlnIdentifier?: bigint, identity?: string) {
    this.wasmFilePath = wasmFilePath
    this.finalZkeyPath = finalZkeyPath
    this.verificationKey = verificationKey
    this.rlnIdentifier = rlnIdentifier ? rlnIdentifier : RLN._genIdentifier()

    this.identity = identity ? new Identity(identity) : new Identity()
    this.commitment = this.identity.getCommitment()
    this.secretIdentity = poseidon([
      this.identity.getNullifier(),
      this.identity.getTrapdoor(),
    ])
    console.info(`RLN identity commitment created: ${this.commitment}`)
  }


  /**
   * Generates an RLN Proof.
   * @param signal This is usually the raw message.
   * @param merkleProof This is the merkle proof for the identity commitment.
   * @param epoch This is the time component for the proof, if no epoch is set, unix epoch time rounded to 1 second will be used.
   * @returns The full SnarkJS proof.
   */
  public async generateProof(signal: string, merkleProof: MerkleProof, epoch?: StrBigInt): Promise<RLNFullProof> {
    const epochBigInt = epoch ? BigInt(epoch) : BigInt(Math.floor(Date.now() / 1000)) // rounded to nearest second
    const witness = this._genWitness(merkleProof, epochBigInt, signal)
    return this._genProof(epochBigInt, witness)
  }

  /**
   * Generates a SnarkJS full proof with Groth16.
   * @param witness The parameters for creating the proof.
   * @returns The full SnarkJS proof.
   */
  public async _genProof(
    epoch: bigint,
    witness: RLNWitnessT,
  ): Promise<RLNFullProof> {
    const snarkProof: RLNSNARKProof = await RLN._genSNARKProof(witness, this.wasmFilePath, this.finalZkeyPath)
    return {
      snarkProof,
      epoch,
      rlnIdentifier: this.rlnIdentifier,
    }
  }

  /**
 * Generates a SnarkJS full proof with Groth16.
 * @param witness The parameters for creating the proof.
 * @param wasmFilePath The path to the wasm file.
 * @param finalZkeyPath The path to the final zkey file.
 * @returns The full SnarkJS proof.
 */
  public static async _genSNARKProof(
    witness: RLNWitnessT, wasmFilePath: string, finalZkeyPath: string,
  ): Promise<RLNSNARKProof> {
    const { proof, publicSignals } = await groth16.fullProve(
      witness,
      wasmFilePath,
      finalZkeyPath,
      null,
    )

    return {
      proof,
      publicSignals: {
        yShare: publicSignals[0],
        merkleRoot: publicSignals[1],
        internalNullifier: publicSignals[2],
        signalHash: publicSignals[3],
        externalNullifier: publicSignals[4],
      },
    }
  }

  /**
   * Verifies a zero-knowledge SnarkJS proof.
   * @param fullProof The SnarkJS full proof.
   * @returns True if the proof is valid, false otherwise.
   */
  public async verifyProof(rlnRullProof: RLNFullProof): Promise<boolean> {
    if (BigInt(rlnRullProof.rlnIdentifier) !== this.rlnIdentifier) {
      throw new Error('RLN identifier does not match')
    }
    const expectedExternalNullifier = RLN._genNullifier(BigInt(rlnRullProof.epoch), this.rlnIdentifier)
    if (expectedExternalNullifier !== BigInt(rlnRullProof.snarkProof.publicSignals.externalNullifier)) {
      throw new Error('External nullifier does not match')
    }

    return RLN.verifySNARKProof(this.verificationKey, rlnRullProof.snarkProof)
  }

  /**
 * Verifies a zero-knowledge SnarkJS proof.
 * @param fullProof The SnarkJS full proof.
 * @returns True if the proof is valid, false otherwise.
 */
  public static async verifySNARKProof(verificationKey: VerificationKeyT,
    { proof, publicSignals }: RLNSNARKProof,
  ): Promise<boolean> {
    return groth16.verify(
      verificationKey,
      [
        publicSignals.yShare,
        publicSignals.merkleRoot,
        publicSignals.internalNullifier,
        publicSignals.signalHash,
        publicSignals.externalNullifier,
      ],
      proof,
    )
  }

  /**
   * Creates witness for rln proof
   * @param merkleProof merkle proof that identity exists in RLN tree
   * @param epoch epoch on which signal is broadcasted
   * @param signal signal that is being broadcasted
   * @param shouldHash should the signal be hashed, default is true
   * @returns rln witness
   */
  public _genWitness(
    merkleProof: MerkleProof,
    epoch: StrBigInt,
    signal: string,
    shouldHash = true,
  ): RLNWitnessT {
    return {
      identitySecret: this.secretIdentity,
      pathElements: merkleProof.siblings,
      identityPathIndex: merkleProof.pathIndices,
      x: shouldHash ? RLN._genSignalHash(signal) : signal,
      externalNullifier: RLN._genNullifier(BigInt(epoch), this.rlnIdentifier),
    }
  }

  /**
   * Calculates Output
   * @param identitySecret identity secret
   * @param epoch epoch on which signal is broadcasted
   * @param rlnIdentifier unique identifier of rln dapp
   * @param signalHash signal hash
   * @returns y_share (share) & slashing nullifier
   */
  public _calculateOutput(
    epoch: bigint,
    signalHash: bigint,
  ): bigint[] {
    const externalNullifier = RLN._genNullifier(epoch, this.rlnIdentifier)
    const a1 = poseidon([this.secretIdentity, externalNullifier])
    // TODO! Check if this is zero/the identity secret
    const yShare = Fq.normalize(a1 * signalHash + this.secretIdentity)
    const internalNullifier = RLN._genNullifier(a1, this.rlnIdentifier)

    return [yShare, internalNullifier]
  }

  /**
   *
   * @param a1 y = a1 * signalHash + a0 (a1 = poseidon(identity secret, epoch, rlnIdentifier))
   * @param rlnIdentifier unique identifier of rln dapp
   * @returns rln slashing nullifier
   */
  public static _genNullifier(a1: bigint, rlnIdentifier: bigint): bigint {
    return poseidon([a1, rlnIdentifier])
  }

  /**
   * Hashes a signal string with Keccak256.
   * @param signal The RLN signal.
   * @returns The signal hash.
   */
  public static _genSignalHash(signal: string): bigint {
    const converted = hexlify(toUtf8Bytes(signal))

    return BigInt(keccak256(['bytes'], [converted])) >> BigInt(8)
  }

  /**
   * Recovers secret from two shares
   * @param x1 signal hash of first message
   * @param x2 signal hash of second message
   * @param y1 yshare of first message
   * @param y2 yshare of second message
   * @returns identity secret
   */
  public static _shamirRecovery(x1: bigint, x2: bigint, y1: bigint, y2: bigint): bigint {
    const slope = Fq.div(Fq.sub(y2, y1), Fq.sub(x2, x1))
    const privateKey = Fq.sub(y1, Fq.mul(slope, x1))

    return Fq.normalize(privateKey)
  }

  /**
   * Recovers secret from two shares from the same internalNullifier (user) and epoch
   * @param proof1 x1
   * @param proof2 x2
   * @returns identity secret
   */
  public static retrieveSecret(proof1: RLNFullProof, proof2: RLNFullProof): bigint {
    if (!isProofSameExternalNullifier(proof1, proof2)) {
      throw new Error('External Nullifiers do not match! Cannot recover secret.')
    }
    const snarkProof1 = proof1.snarkProof
    const snarkProof2 = proof2.snarkProof
    if (snarkProof1.publicSignals.internalNullifier !== snarkProof2.publicSignals.internalNullifier) {
      // The internalNullifier is made up of the identityCommitment + epoch + rlnappID,
      // so if they are different, the proofs are from:
      // different users,
      // different epochs,
      // or different rln applications
      throw new Error('Internal Nullifiers do not match! Cannot recover secret.')
    }
    return RLN._shamirRecovery(
      BigInt(snarkProof1.publicSignals.signalHash),
      BigInt(snarkProof2.publicSignals.signalHash),
      BigInt(snarkProof1.publicSignals.yShare),
      BigInt(snarkProof2.publicSignals.yShare),
    )
  }

  /**
   *
   * @returns unique identifier of the rln dapp
   */
  public static _genIdentifier(): bigint {
    return Fq.random()
  }

  public static _bigintToUint8Array(input: bigint): Uint8Array {
    // const bigIntAsStr = input.toString()
    // return Uint8Array.from(Array.from(bigIntAsStr).map(letter => letter.charCodeAt(0)));
    return new Uint8Array(new BigUint64Array([input]).buffer)
  }

  public export(): RLNExportedT {
    console.debug('Exporting RLN instance')
    return {
      identity: this.identity.toString(),
      rlnIdentifier: String(this.rlnIdentifier),
      verificationKey: JSON.stringify(this.verificationKey),
      wasmFilePath: this.wasmFilePath,
      finalZkeyPath: this.finalZkeyPath,
    }
  }

  public static import(rlnInstance: RLNExportedT): RLN {
    console.debug('Importing RLN instance')
    return new RLN(
      rlnInstance.wasmFilePath,
      rlnInstance.finalZkeyPath,
      JSON.parse(rlnInstance.verificationKey),
      BigInt(rlnInstance.rlnIdentifier),
      rlnInstance.identity,
    )
  }
}
