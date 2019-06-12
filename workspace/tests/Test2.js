describe("Check if a new data can be created", function() {
    it('should add a new data general public expenses', function() {
        browser.
        get("http://localhost:8080/#!/ui/v1/deceaseds");
        element.all(by.repeater('deceased in deceaseds')).then(function(getLista) {

            element(by.model('newDeceased.province')).sendKeys('Valencia');
            element(by.model('newDeceased.year')).sendKeys(2015);
            element(by.model('newDeceased.life')).sendKeys(234);
            element(by.model('newDeceased.penalty')).sendKeys(234);
            element(by.model('newDeceased.number')).sendKeys(234);


            element(by.id('add')).click();

            element.all(by.repeater('deceased in deceaseds')).then(function(getListaFinal) {

                expect(getListaFinal.length).toEqual(getLista.length + 1);
            });
        });
    });
});