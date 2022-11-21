"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = __importDefault(require("../src/registry"));
describe("Registry", () => {
    describe("# Registry", () => {
        it("Should create a registry", async () => {
            const registry = new registry_1.default();
            await registry.init();
            expect(registry.root.toString()).toContain("150197");
            expect(registry.depth).toBe(20);
            expect(registry.zeroValue).toBe(BigInt(0));
            expect(registry.members).toHaveLength(0);
        });
        it("Should not create a registry with a wrong tree depth", () => {
            const wrongRegistry = () => new registry_1.default(33);
            expect(wrongRegistry).toThrow("The tree depth must be between 16 and 32");
        });
        it("Should create a group with different parameters", async () => {
            const registry = new registry_1.default(32, BigInt(1));
            await registry.init();
            expect(registry.root.toString()).toContain("640470");
            expect(registry.depth).toBe(32);
            expect(registry.zeroValue).toBe(BigInt(1));
            expect(registry.members).toHaveLength(0);
        });
        describe("# addMember", () => {
            it("Should add a member to a group", async () => {
                const registry = new registry_1.default();
                await registry.init();
                registry.addMember(BigInt(3));
                expect(registry.members).toHaveLength(1);
            });
        });
        describe("# addMembers", () => {
            it("Should add many members to a group", async () => {
                const registry = new registry_1.default();
                await registry.init();
                registry.addMembers([BigInt(1), BigInt(3)]);
                expect(registry.members).toHaveLength(2);
            });
        });
        describe("# indexOf", () => {
            it("Should return the index of a member in a group", async () => {
                const registry = new registry_1.default();
                await registry.init();
                registry.addMembers([BigInt(1), BigInt(3)]);
                const index = registry.indexOf(BigInt(3));
                expect(index).toBe(1);
            });
        });
        describe("# removeMember", () => {
            it("Should remove a member from a group", async () => {
                const registry = new registry_1.default();
                await registry.init();
                registry.addMembers([BigInt(1), BigInt(3)]);
                registry.removeMember(0);
                expect(registry.members).toHaveLength(2);
                expect(registry.members[0]).toBe(registry.zeroValue);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cnkudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3RzL3JlZ2lzdHJ5LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrREFBc0M7QUFFdEMsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7SUFDdEIsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFDeEIsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3RDLE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsRUFBRSxDQUFBO1lBQy9CLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFBO1lBRXJCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3BELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQy9CLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzVDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtZQUM1RCxNQUFNLGFBQWEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGtCQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFFNUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwQ0FBMEMsQ0FBQyxDQUFBO1FBQzdFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzdELE1BQU0sUUFBUSxHQUFHLElBQUks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RXhCLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUN4QyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDeEQsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVnaXN0cnkgZnJvbSBcIi4uL3NyYy9yZWdpc3RyeVwiXG5cbmRlc2NyaWJlKFwiUmVnaXN0cnlcIiwgKCkgPT4ge1xuICAgIGRlc2NyaWJlKFwiIyBSZWdpc3RyeVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiU2hvdWxkIGNyZWF0ZSBhIHJlZ2lzdHJ5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KClcbiAgICAgICAgICAgIGF3YWl0IHJlZ2lzdHJ5LmluaXQoKVxuXG4gICAgICAgICAgICBleHBlY3QocmVnaXN0cnkucm9vdC50b1N0cmluZygpKS50b0NvbnRhaW4oXCIxNTAxOTdcIilcbiAgICAgICAgICAgIGV4cGVjdChyZWdpc3RyeS5kZXB0aCkudG9CZSgyMClcbiAgICAgICAgICAgIGV4cGVjdChyZWdpc3RyeS56ZXJvVmFsdWUpLnRvQmUoQmlnSW50KDApKVxuICAgICAgICAgICAgZXhwZWN0KHJlZ2lzdHJ5Lm1lbWJlcnMpLnRvSGF2ZUxlbmd0aCgwKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KFwiU2hvdWxkIG5vdCBjcmVhdGUgYSByZWdpc3RyeSB3aXRoIGEgd3JvbmcgdHJlZSBkZXB0aFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB3cm9uZ1JlZ2lzdHJ5ID0gKCkgPT4gbmV3IFJlZ2lzdHJ5KDMzKVxuXG4gICAgICAgICAgICBleHBlY3Qod3JvbmdSZWdpc3RyeSkudG9UaHJvdyhcIlRoZSB0cmVlIGRlcHRoIG11c3QgYmUgYmV0d2VlbiAxNiBhbmQgMzJcIilcbiAgICAgICAgfSlcblxuICAgICAgICBpdChcIlNob3VsZCBjcmVhdGUgYSBncm91cCB3aXRoIGRpZmZlcmVudCBwYXJhbWV0ZXJzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KDMyLCBCaWdJbnQoMSkpXG4gICAgICAgICAgICBhd2FpdCByZWdpc3RyeS5pbml0KClcblxuICAgICAgICAgICAgZXhwZWN0KHJlZ2lzdHJ5LnJvb3QudG9TdHJpbmcoKSkudG9Db250YWluKFwiNjQwNDcwXCIpXG4gICAgICAgICAgICBleHBlY3QocmVnaXN0cnkuZGVwdGgpLnRvQmUoMzIpXG4gICAgICAgICAgICBleHBlY3QocmVnaXN0cnkuemVyb1ZhbHVlKS50b0JlKEJpZ0ludCgxKSlcbiAgICAgICAgICAgIGV4cGVjdChyZWdpc3RyeS5tZW1iZXJzKS50b0hhdmVMZW5ndGgoMClcbiAgICAgICAgfSlcblxuICAgICAgICBkZXNjcmliZShcIiMgYWRkTWVtYmVyXCIsICgpID0+IHtcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIGFkZCBhIG1lbWJlciB0byBhIGdyb3VwXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWdpc3RyeSA9IG5ldyBSZWdpc3RyeSgpXG4gICAgICAgICAgICAgICAgYXdhaXQgcmVnaXN0cnkuaW5pdCgpXG5cbiAgICAgICAgICAgICAgICByZWdpc3RyeS5hZGRNZW1iZXIoQmlnSW50KDMpKVxuXG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlZ2lzdHJ5Lm1lbWJlcnMpLnRvSGF2ZUxlbmd0aCgxKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICBkZXNjcmliZShcIiMgYWRkTWVtYmVyc1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBpdChcIlNob3VsZCBhZGQgbWFueSBtZW1iZXJzIHRvIGEgZ3JvdXBcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KClcbiAgICAgICAgICAgICAgICBhd2FpdCByZWdpc3RyeS5pbml0KClcblxuICAgICAgICAgICAgICAgIHJlZ2lzdHJ5LmFkZE1lbWJlcnMoW0JpZ0ludCgxKSwgQmlnSW50KDMpXSlcblxuICAgICAgICAgICAgICAgIGV4cGVjdChyZWdpc3RyeS5tZW1iZXJzKS50b0hhdmVMZW5ndGgoMilcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgZGVzY3JpYmUoXCIjIGluZGV4T2ZcIiwgKCkgPT4ge1xuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIHRoZSBpbmRleCBvZiBhIG1lbWJlciBpbiBhIGdyb3VwXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWdpc3RyeSA9IG5ldyBSZWdpc3RyeSgpXG4gICAgICAgICAgICAgICAgYXdhaXQgcmVnaXN0cnkuaW5pdCgpXG5cbiAgICAgICAgICAgICAgICByZWdpc3RyeS5hZGRNZW1iZXJzKFtCaWdJbnQoMSksIEJpZ0ludCgzKV0pXG5cbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHJlZ2lzdHJ5LmluZGV4T2YoQmlnSW50KDMpKVxuXG4gICAgICAgICAgICAgICAgZXhwZWN0KGluZGV4KS50b0JlKDEpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIGRlc2NyaWJlKFwiIyByZW1vdmVNZW1iZXJcIiwgKCkgPT4ge1xuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmVtb3ZlIGEgbWVtYmVyIGZyb20gYSBncm91cFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnkoKVxuICAgICAgICAgICAgICAgIGF3YWl0IHJlZ2lzdHJ5LmluaXQoKVxuXG4gICAgICAgICAgICAgICAgcmVnaXN0cnkuYWRkTWVtYmVycyhbQmlnSW50KDEpLCBCaWdJbnQoMyldKVxuXG4gICAgICAgICAgICAgICAgcmVnaXN0cnkucmVtb3ZlTWVtYmVyKDApXG5cbiAgICAgICAgICAgICAgICBleHBlY3QocmVnaXN0cnkubWVtYmVycykudG9IYXZlTGVuZ3RoKDIpXG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlZ2lzdHJ5Lm1lbWJlcnNbMF0pLnRvQmUocmVnaXN0cnkuemVyb1ZhbHVlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9KVxufSlcbiJdfQ==