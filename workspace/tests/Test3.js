describe("Check if a data can be deleted", function() {
    it('should delete a general public expenses ', function() {
        browser.
        get("http://localhost:8080/#!/ui/v1/motogp");
        element.all(by.repeater('race in motogp')).then(function(getLista) {
            var d = element(by.model('delete(Jerez)'));
            element(by.id('delete')).click();
        });
    });
});
