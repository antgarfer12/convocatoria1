describe("Check if data is loaded: ", function() {
    it("List shows that there are items", function() {
        browser.get("http://localhost:8080/#!/ui/v1/deceaseds");
        var contacts = element.all(by.repeater("deceased in deceaseds"));
        expect(contacts.count()).toBeGreaterThan(0);
    });

});
