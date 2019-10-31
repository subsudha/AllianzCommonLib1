describe("sample", function() {
    var sample = System.getModule("com.allianz.common").sample;
    it("should add two numbers", function() {
        expect(sample(5, 2)).toBe(7);
    });
});
