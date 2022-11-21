import { ZkIdentity } from "@zk-kit/identity";
import { getCurveFromName } from "ffjavascript";
import * as fs from "fs";
import * as path from "path";
import { RLN } from "../src";
import { generateMerkleProof, genExternalNullifier } from "../src/utils";
describe("RLN", () => {
    const zkeyFiles = "./packages/protocols/zkeyFiles";
    const identityCommitments = [];
    let curve;
    beforeAll(async () => {
        curve = await getCurveFromName("bn128");
        const numberOfLeaves = 3;
        for (let i = 0; i < numberOfLeaves; i += 1) {
            const identity = new ZkIdentity();
            const identityCommitment = identity.genIdentityCommitment();
            identityCommitments.push(identityCommitment);
        }
    });
    afterAll(async () => {
        await curve.terminate();
    });
    describe("RLN functionalities", () => {
        it("Should generate rln witness", async () => {
            const identity = new ZkIdentity();
            const identityCommitment = identity.genIdentityCommitment();
            const secretHash = identity.getSecretHash();
            const leaves = Object.assign([], identityCommitments);
            leaves.push(identityCommitment);
            const signal = "hey hey";
            const epoch = genExternalNullifier("test-epoch");
            const rlnIdentifier = RLN.genIdentifier();
            const merkleProof = await generateMerkleProof(15, BigInt(0), leaves, identityCommitment);
            const witness = RLN.genWitness(secretHash, merkleProof, epoch, signal, rlnIdentifier);
            expect(typeof witness).toBe("object");
        });
        it("Should throw an exception for a zero leaf", () => {
            const zeroIdCommitment = BigInt(0);
            const leaves = Object.assign([], identityCommitments);
            leaves.push(zeroIdCommitment);
            const fun = async () => await generateMerkleProof(15, zeroIdCommitment, leaves, zeroIdCommitment);
            expect(fun).rejects.toThrow("Can't generate a proof for a zero leaf");
        });
        it("Should retrieve user secret after spaming", async () => {
            const identity = new ZkIdentity();
            const secretHash = identity.getSecretHash();
            const signal1 = "hey hey";
            const signalHash1 = RLN.genSignalHash(signal1);
            const signal2 = "hey hey again";
            const signalHash2 = RLN.genSignalHash(signal2);
            const epoch = genExternalNullifier("test-epoch");
            const rlnIdentifier = RLN.genIdentifier();
            const [y1] = await RLN.calculateOutput(secretHash, BigInt(epoch), rlnIdentifier, signalHash1);
            const [y2] = await RLN.calculateOutput(secretHash, BigInt(epoch), rlnIdentifier, signalHash2);
            const retrievedSecret = RLN.retrieveSecret(signalHash1, signalHash2, y1, y2);
            expect(retrievedSecret).toEqual(secretHash);
        });
        // eslint-disable-next-line jest/no-disabled-tests
        it.skip("Should generate and verify RLN proof", async () => {
            const identity = new ZkIdentity();
            const secretHash = identity.getSecretHash();
            const identityCommitment = identity.genIdentityCommitment();
            const leaves = Object.assign([], identityCommitments);
            leaves.push(identityCommitment);
            const signal = "hey hey";
            const epoch = genExternalNullifier("test-epoch");
            const rlnIdentifier = RLN.genIdentifier();
            const merkleProof = await generateMerkleProof(15, BigInt(0), leaves, identityCommitment);
            const witness = RLN.genWitness(secretHash, merkleProof, epoch, signal, rlnIdentifier);
            const vkeyPath = path.join(zkeyFiles, "rln", "verification_key.json");
            const vKey = JSON.parse(fs.readFileSync(vkeyPath, "utf-8"));
            const wasmFilePath = path.join(zkeyFiles, "rln", "rln.wasm");
            const finalZkeyPath = path.join(zkeyFiles, "rln", "rln_final.zkey");
            const fullProof = await RLN.genProof(witness, wasmFilePath, finalZkeyPath);
            const response = await RLN.verifyProof(vKey, fullProof);
            expect(response).toBe(true);
        }, 30000);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmxuLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9ybG4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUE7QUFDN0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sY0FBYyxDQUFBO0FBQy9DLE9BQU8sS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFBO0FBQ3hCLE9BQU8sS0FBSyxJQUFJLE1BQU0sTUFBTSxDQUFBO0FBQzVCLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxRQUFRLENBQUE7QUFDNUIsT0FBTyxFQUFFLG1CQUFtQixFQUFFLG9CQUFvQixFQUFFLE1BQU0sY0FBYyxDQUFBO0FBRXhFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0lBQ25CLE1BQU0sU0FBUyxHQUFHLGdDQUFnQyxDQUFBO0lBQ2xELE1BQU0sbUJBQW1CLEdBQWEsRUFBRSxDQUFBO0lBRXhDLElBQUksS0FBVSxDQUFBO0lBRWQsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ25CLEtBQUssR0FBRyxNQUFNLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRXZDLE1BQU0sY0FBYyxHQUFHLENBQUMsQ0FBQTtRQUV4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDMUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQTtZQUNqQyxNQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO1lBRTNELG1CQUFtQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1NBQzdDO0lBQ0gsQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbEIsTUFBTSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUE7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QUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7WUFFM0QsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFBO1lBQzVELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO1lBRW5FLE1BQU0sU0FBUyxHQUFHLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFBO1lBQzFFLE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUE7WUFFdkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUM3QixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDWCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgWmtJZGVudGl0eSB9IGZyb20gXCJAemsta2l0L2lkZW50aXR5XCJcbmltcG9ydCB7IGdldEN1cnZlRnJvbU5hbWUgfSBmcm9tIFwiZmZqYXZhc2NyaXB0XCJcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCJcbmltcG9ydCB7IFJMTiB9IGZyb20gXCIuLi9zcmNcIlxuaW1wb3J0IHsgZ2VuZXJhdGVNZXJrbGVQcm9vZiwgZ2VuRXh0ZXJuYWxOdWxsaWZpZXIgfSBmcm9tIFwiLi4vc3JjL3V0aWxzXCJcblxuZGVzY3JpYmUoXCJSTE5cIiwgKCkgPT4ge1xuICBjb25zdCB6a2V5RmlsZXMgPSBcIi4vcGFja2FnZXMvcHJvdG9jb2xzL3prZXlGaWxlc1wiXG4gIGNvbnN0IGlkZW50aXR5Q29tbWl0bWVudHM6IGJpZ2ludFtdID0gW11cblxuICBsZXQgY3VydmU6IGFueVxuXG4gIGJlZm9yZUFsbChhc3luYyAoKSA9PiB7XG4gICAgY3VydmUgPSBhd2FpdCBnZXRDdXJ2ZUZyb21OYW1lKFwiYm4xMjhcIilcblxuICAgIGNvbnN0IG51bWJlck9mTGVhdmVzID0gM1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZkxlYXZlczsgaSArPSAxKSB7XG4gICAgICBjb25zdCBpZGVudGl0eSA9IG5ldyBaa0lkZW50aXR5KClcbiAgICAgIGNvbnN0IGlkZW50aXR5Q29tbWl0bWVudCA9IGlkZW50aXR5LmdlbklkZW50aXR5Q29tbWl0bWVudCgpXG5cbiAgICAgIGlkZW50aXR5Q29tbWl0bWVudHMucHVzaChpZGVudGl0eUNvbW1pdG1lbnQpXG4gICAgfVxuICB9KVxuXG4gIGFmdGVyQWxsKGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBjdXJ2ZS50ZXJtaW5hdGUoKVxuICB9KVxuXG4gIGRlc2NyaWJlKFwiUkxOIGZ1bmN0aW9uYWxpdGllc1wiLCAoKSA9PiB7XG4gICAgaXQoXCJTaG91bGQgZ2VuZXJhdGUgcmxuIHdpdG5lc3NcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaWRlbnRpdHkgPSBuZXcgWmtJZGVudGl0eSgpXG4gICAgICBjb25zdCBpZGVudGl0eUNvbW1pdG1lbnQgPSBpZGVudGl0eS5nZW5JZGVudGl0eUNvbW1pdG1lbnQoKVxuICAgICAgY29uc3Qgc2VjcmV0SGFzaCA9IGlkZW50aXR5LmdldFNlY3JldEhhc2goKVxuXG4gICAgICBjb25zdCBsZWF2ZXMgPSBPYmplY3QuYXNzaWduKFtdLCBpZGVudGl0eUNvbW1pdG1lbnRzKVxuICAgICAgbGVhdmVzLnB1c2goaWRlbnRpdHlDb21taXRtZW50KVxuXG4gICAgICBjb25zdCBzaWduYWwgPSBcImhleSBoZXlcIlxuICAgICAgY29uc3QgZXBvY2g6IHN0cmluZyA9IGdlbkV4dGVybmFsTnVsbGlmaWVyKFwidGVzdC1lcG9jaFwiKVxuICAgICAgY29uc3QgcmxuSWRlbnRpZmllciA9IFJMTi5nZW5JZGVudGlmaWVyKClcblxuICAgICAgY29uc3QgbWVya2xlUHJvb2YgPSBhd2FpdCBnZW5lcmF0ZU1lcmtsZVByb29mKDE1LCBCaWdJbnQoMCksIGxlYXZlcywgaWRlbnRpdHlDb21taXRtZW50KVxuICAgICAgY29uc3Qgd2l0bmVzcyA9IFJMTi5nZW5XaXRuZXNzKHNlY3JldEhhc2gsIG1lcmtsZVByb29mLCBlcG9jaCwgc2lnbmFsLCBybG5JZGVudGlmaWVyKVxuXG4gICAgICBleHBlY3QodHlwZW9mIHdpdG5lc3MpLnRvQmUoXCJvYmplY3RcIilcbiAgICB9KVxuXG4gICAgaXQoXCJTaG91bGQgdGhyb3cgYW4gZXhjZXB0aW9uIGZvciBhIHplcm8gbGVhZlwiLCAoKSA9PiB7XG4gICAgICBjb25zdCB6ZXJvSWRDb21taXRtZW50ID0gQmlnSW50KDApXG4gICAgICBjb25zdCBsZWF2ZXMgPSBPYmplY3QuYXNzaWduKFtdLCBpZGVudGl0eUNvbW1pdG1lbnRzKVxuICAgICAgbGVhdmVzLnB1c2goemVyb0lkQ29tbWl0bWVudClcblxuICAgICAgY29uc3QgZnVuID0gYXN5bmMoKSA9PiBhd2FpdCBnZW5lcmF0ZU1lcmtsZVByb29mKDE1LCB6ZXJvSWRDb21taXRtZW50LCBsZWF2ZXMsIHplcm9JZENvbW1pdG1lbnQpXG5cbiAgICAgIGV4cGVjdChmdW4pLnJlamVjdHMudG9UaHJvdyhcIkNhbid0IGdlbmVyYXRlIGEgcHJvb2YgZm9yIGEgemVybyBsZWFmXCIpXG4gICAgfSlcblxuICAgIGl0KFwiU2hvdWxkIHJldHJpZXZlIHVzZXIgc2VjcmV0IGFmdGVyIHNwYW1pbmdcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaWRlbnRpdHkgPSBuZXcgWmtJZGVudGl0eSgpXG4gICAgICBjb25zdCBzZWNyZXRIYXNoID0gaWRlbnRpdHkuZ2V0U2VjcmV0SGFzaCgpXG5cbiAgICAgIGNvbnN0IHNpZ25hbDEgPSBcImhleSBoZXlcIlxuICAgICAgY29uc3Qgc2lnbmFsSGFzaDEgPSBSTE4uZ2VuU2lnbmFsSGFzaChzaWduYWwxKVxuICAgICAgY29uc3Qgc2lnbmFsMiA9IFwiaGV5IGhleSBhZ2FpblwiXG4gICAgICBjb25zdCBzaWduYWxIYXNoMiA9IFJMTi5nZW5TaWduYWxIYXNoKHNpZ25hbDIpXG5cbiAgICAgIGNvbnN0IGVwb2NoID0gZ2VuRXh0ZXJuYWxOdWxsaWZpZXIoXCJ0ZXN0LWVwb2NoXCIpXG4gICAgICBjb25zdCBybG5JZGVudGlmaWVyID0gUkxOLmdlbklkZW50aWZpZXIoKVxuXG4gICAgICBjb25zdCBbeTFdID0gYXdhaXQgUkxOLmNhbGN1bGF0ZU91dHB1dChzZWNyZXRIYXNoLCBCaWdJbnQoZXBvY2gpLCBybG5JZGVudGlmaWVyLCBzaWduYWxIYXNoMSlcbiAgICAgIGNvbnN0IFt5Ml0gPSBhd2FpdCBSTE4uY2FsY3VsYXRlT3V0cHV0KHNlY3JldEhhc2gsIEJpZ0ludChlcG9jaCksIHJsbklkZW50aWZpZXIsIHNpZ25hbEhhc2gyKVxuXG4gICAgICBjb25zdCByZXRyaWV2ZWRTZWNyZXQgPSBSTE4ucmV0cmlldmVTZWNyZXQoc2lnbmFsSGFzaDEsIHNpZ25hbEhhc2gyLCB5MSwgeTIpXG5cbiAgICAgIGV4cGVjdChyZXRyaWV2ZWRTZWNyZXQpLnRvRXF1YWwoc2VjcmV0SGFzaClcbiAgICB9KVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGplc3Qvbm8tZGlzYWJsZWQtdGVzdHNcbiAgICBpdC5za2lwKFwiU2hvdWxkIGdlbmVyYXRlIGFuZCB2ZXJpZnkgUkxOIHByb29mXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGlkZW50aXR5ID0gbmV3IFprSWRlbnRpdHkoKVxuICAgICAgY29uc3Qgc2VjcmV0SGFzaCA9IGlkZW50aXR5LmdldFNlY3JldEhhc2goKVxuICAgICAgY29uc3QgaWRlbnRpdHlDb21taXRtZW50ID0gaWRlbnRpdHkuZ2VuSWRlbnRpdHlDb21taXRtZW50KClcblxuICAgICAgY29uc3QgbGVhdmVzID0gT2JqZWN0LmFzc2lnbihbXSwgaWRlbnRpdHlDb21taXRtZW50cylcbiAgICAgIGxlYXZlcy5wdXNoKGlkZW50aXR5Q29tbWl0bWVudClcblxuICAgICAgY29uc3Qgc2lnbmFsID0gXCJoZXkgaGV5XCJcbiAgICAgIGNvbnN0IGVwb2NoID0gZ2VuRXh0ZXJuYWxOdWxsaWZpZXIoXCJ0ZXN0LWVwb2NoXCIpXG4gICAgICBjb25zdCBybG5JZGVudGlmaWVyID0gUkxOLmdlbklkZW50aWZpZXIoKVxuXG4gICAgICBjb25zdCBtZXJrbGVQcm9vZiA9IGF3YWl0IGdlbmVyYXRlTWVya2xlUHJvb2YoMTUsIEJpZ0ludCgwKSwgbGVhdmVzLCBpZGVudGl0eUNvbW1pdG1lbnQpXG4gICAgICBjb25zdCB3aXRuZXNzID0gUkxOLmdlbldpdG5lc3Moc2VjcmV0SGFzaCwgbWVya2xlUHJvb2YsIGVwb2NoLCBzaWduYWwsIHJsbklkZW50aWZpZXIpXG5cbiAgICAgIGNvbnN0IHZrZXlQYXRoID0gcGF0aC5qb2luKHprZXlGaWxlcywgXCJybG5cIiwgXCJ2ZXJpZmljYXRpb25fa2V5Lmpzb25cIilcbiAgICAgIGNvbnN0IHZLZXkgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyh2a2V5UGF0aCwgXCJ1dGYtOFwiKSlcblxuICAgICAgY29uc3Qgd2FzbUZpbGVQYXRoID0gcGF0aC5qb2luKHprZXlGaWxlcywgXCJybG5cIiwgXCJybG4ud2FzbVwiKVxuICAgICAgY29uc3QgZmluYWxaa2V5UGF0aCA9IHBhdGguam9pbih6a2V5RmlsZXMsIFwicmxuXCIsIFwicmxuX2ZpbmFsLnprZXlcIilcblxuICAgICAgY29uc3QgZnVsbFByb29mID0gYXdhaXQgUkxOLmdlblByb29mKHdpdG5lc3MsIHdhc21GaWxlUGF0aCwgZmluYWxaa2V5UGF0aClcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgUkxOLnZlcmlmeVByb29mKHZLZXksIGZ1bGxQcm9vZilcblxuICAgICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHRydWUpXG4gICAgfSwgMzAwMDApXG4gIH0pXG59KVxuIl19