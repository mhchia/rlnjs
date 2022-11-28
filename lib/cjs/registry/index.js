"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const incremental_merkle_tree_1 = require("@zk-kit/incremental-merkle-tree");
const utils_1 = require("../utils");
class Registry {
    /**
     * Initializes the group with the tree depth and the zero value.
     * @param treeDepth Tree depth.
     * @param zeroValue Zero values for zeroes.
     */
    constructor(treeDepth = 20, zeroValue = BigInt(0)) {
        if (treeDepth < 16 || treeDepth > 32) {
            throw new Error("The tree depth must be between 16 and 32");
        }
        this._treeDepth = treeDepth;
        this._zeroValue = zeroValue;
    }
    /**
     * Returns the root hash of the tree.
     * @returns Root hash.
     */
    get root() {
        return this._merkleTree.root;
    }
    /**
     * Returns the depth of the tree.
     * @returns Tree depth.
     */
    get depth() {
        return this._merkleTree.depth;
    }
    /**
     * Returns the zero value of the tree.
     * @returns Tree zero value.
     */
    get zeroValue() {
        return this._merkleTree.zeroes[0];
    }
    /**
     * Returns the members (i.e. identity commitments) of the group.
     * @returns List of members.
     */
    get members() {
        return this._merkleTree.leaves;
    }
    async init() {
        const poseidon = await (0, utils_1.buildPoseidon)();
        this._merkleTree = new incremental_merkle_tree_1.IncrementalMerkleTree(poseidon, this._treeDepth, this._zeroValue, 2);
    }
    /**
     * Returns the index of a member. If the member does not exist it returns -1.
     * @param member Group member.
     * @returns Index of the member.
     */
    indexOf(member) {
        return this._merkleTree.indexOf(member);
    }
    /**
     * Adds a new member to the group.
     * @param identityCommitment New member.
     */
    addMember(identityCommitment) {
        this._merkleTree.insert(BigInt(identityCommitment));
    }
    /**
     * Adds new members to the group.
     * @param identityCommitments New members.
     */
    addMembers(identityCommitments) {
        for (const identityCommitment of identityCommitments) {
            this.addMember(identityCommitment);
        }
    }
    /**
     * Removes a member from the group.
     * @param index Index of the member to be removed.
     */
    removeMember(index) {
        this._merkleTree.delete(index);
    }
}
exports.default = Registry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcmVnaXN0cnkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2RUFFeUM7QUFDekMsb0NBQXlDO0FBR3pDLE1BQXFCLFFBQVE7SUFLM0I7Ozs7T0FJRztJQUNILFlBQVksU0FBUyxHQUFHLEVBQUUsRUFBRSxZQUFvQixNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQUksU0FBUyxHQUFHLEVBQUUsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO1lBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztTQUM3RDtRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFBO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFBO0lBQzdCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0lBQy9CLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSxxQkFBYSxHQUFFLENBQUE7UUFFdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLCtDQUFxQixDQUMxQyxRQUFRLEVBQ1IsSUFBSSxDQUFDLFVBQVUsRUFDZixJQUFJLENBQUMsVUFBVSxFQUNmLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxPQUFPLENBQUMsTUFBYztRQUNwQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLENBQUMsa0JBQTBCO1FBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILFVBQVUsQ0FBQyxtQkFBNkI7UUFDdEMsS0FBSyxNQUFNLGtCQUFrQixJQUFJLG1CQUFtQixFQUFFO1lBQ3BELElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxZQUFZLENBQUMsS0FBYTtRQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0NBQ0Y7QUEvRkQsMkJBK0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgSW5jcmVtZW50YWxNZXJrbGVUcmVlLFxufSBmcm9tIFwiQHprLWtpdC9pbmNyZW1lbnRhbC1tZXJrbGUtdHJlZVwiO1xuaW1wb3J0IHsgYnVpbGRQb3NlaWRvbiB9IGZyb20gXCIuLi91dGlsc1wiO1xuaW1wb3J0IHsgTWVtYmVyIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVnaXN0cnkge1xuICBwcml2YXRlIF9tZXJrbGVUcmVlOiBJbmNyZW1lbnRhbE1lcmtsZVRyZWU7XG4gIHByaXZhdGUgX3RyZWVEZXB0aDogbnVtYmVyO1xuICBwcml2YXRlIF96ZXJvVmFsdWU6IE1lbWJlcjtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIGdyb3VwIHdpdGggdGhlIHRyZWUgZGVwdGggYW5kIHRoZSB6ZXJvIHZhbHVlLlxuICAgKiBAcGFyYW0gdHJlZURlcHRoIFRyZWUgZGVwdGguXG4gICAqIEBwYXJhbSB6ZXJvVmFsdWUgWmVybyB2YWx1ZXMgZm9yIHplcm9lcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHRyZWVEZXB0aCA9IDIwLCB6ZXJvVmFsdWU6IE1lbWJlciA9IEJpZ0ludCgwKSkge1xuICAgIGlmICh0cmVlRGVwdGggPCAxNiB8fCB0cmVlRGVwdGggPiAzMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHRyZWUgZGVwdGggbXVzdCBiZSBiZXR3ZWVuIDE2IGFuZCAzMlwiKTtcbiAgICB9XG4gICAgdGhpcy5fdHJlZURlcHRoID0gdHJlZURlcHRoXG4gICAgdGhpcy5femVyb1ZhbHVlID0gemVyb1ZhbHVlXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCBoYXNoIG9mIHRoZSB0cmVlLlxuICAgKiBAcmV0dXJucyBSb290IGhhc2guXG4gICAqL1xuICBnZXQgcm9vdCgpOiBNZW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9tZXJrbGVUcmVlLnJvb3Q7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGVwdGggb2YgdGhlIHRyZWUuXG4gICAqIEByZXR1cm5zIFRyZWUgZGVwdGguXG4gICAqL1xuICBnZXQgZGVwdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbWVya2xlVHJlZS5kZXB0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB6ZXJvIHZhbHVlIG9mIHRoZSB0cmVlLlxuICAgKiBAcmV0dXJucyBUcmVlIHplcm8gdmFsdWUuXG4gICAqL1xuICBnZXQgemVyb1ZhbHVlKCk6IE1lbWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21lcmtsZVRyZWUuemVyb2VzWzBdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1lbWJlcnMgKGkuZS4gaWRlbnRpdHkgY29tbWl0bWVudHMpIG9mIHRoZSBncm91cC5cbiAgICogQHJldHVybnMgTGlzdCBvZiBtZW1iZXJzLlxuICAgKi9cbiAgZ2V0IG1lbWJlcnMoKTogTWVtYmVyW10ge1xuICAgIHJldHVybiB0aGlzLl9tZXJrbGVUcmVlLmxlYXZlcztcbiAgfVxuXG4gIGFzeW5jIGluaXQoKSB7XG4gICAgY29uc3QgcG9zZWlkb24gPSBhd2FpdCBidWlsZFBvc2VpZG9uKClcblxuICAgIHRoaXMuX21lcmtsZVRyZWUgPSBuZXcgSW5jcmVtZW50YWxNZXJrbGVUcmVlKFxuICAgICAgcG9zZWlkb24sXG4gICAgICB0aGlzLl90cmVlRGVwdGgsXG4gICAgICB0aGlzLl96ZXJvVmFsdWUsXG4gICAgICAyXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpbmRleCBvZiBhIG1lbWJlci4gSWYgdGhlIG1lbWJlciBkb2VzIG5vdCBleGlzdCBpdCByZXR1cm5zIC0xLlxuICAgKiBAcGFyYW0gbWVtYmVyIEdyb3VwIG1lbWJlci5cbiAgICogQHJldHVybnMgSW5kZXggb2YgdGhlIG1lbWJlci5cbiAgICovXG4gIGluZGV4T2YobWVtYmVyOiBNZW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9tZXJrbGVUcmVlLmluZGV4T2YobWVtYmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbmV3IG1lbWJlciB0byB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSBpZGVudGl0eUNvbW1pdG1lbnQgTmV3IG1lbWJlci5cbiAgICovXG4gIGFkZE1lbWJlcihpZGVudGl0eUNvbW1pdG1lbnQ6IE1lbWJlcikge1xuICAgIHRoaXMuX21lcmtsZVRyZWUuaW5zZXJ0KEJpZ0ludChpZGVudGl0eUNvbW1pdG1lbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIG5ldyBtZW1iZXJzIHRvIHRoZSBncm91cC5cbiAgICogQHBhcmFtIGlkZW50aXR5Q29tbWl0bWVudHMgTmV3IG1lbWJlcnMuXG4gICAqL1xuICBhZGRNZW1iZXJzKGlkZW50aXR5Q29tbWl0bWVudHM6IE1lbWJlcltdKSB7XG4gICAgZm9yIChjb25zdCBpZGVudGl0eUNvbW1pdG1lbnQgb2YgaWRlbnRpdHlDb21taXRtZW50cykge1xuICAgICAgdGhpcy5hZGRNZW1iZXIoaWRlbnRpdHlDb21taXRtZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIG1lbWJlciBmcm9tIHRoZSBncm91cC5cbiAgICogQHBhcmFtIGluZGV4IEluZGV4IG9mIHRoZSBtZW1iZXIgdG8gYmUgcmVtb3ZlZC5cbiAgICovXG4gIHJlbW92ZU1lbWJlcihpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5fbWVya2xlVHJlZS5kZWxldGUoaW5kZXgpO1xuICB9XG59XG4iXX0=