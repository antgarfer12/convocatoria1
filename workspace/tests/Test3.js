describe("Check if a data can be deleted", function() {
    it('should delete a general public expenses ', function() {
        browser.
        get("http://localhost:8080/#!/ui/v1/deceaseds");
        element.all(by.repeater('deceased in deceaseds')).then(function(getLista) {
            var d = element(by.model('delete(Seville)'));
            element(by.id('delete')).click();
        });
    });
});
