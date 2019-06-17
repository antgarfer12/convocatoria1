describe("Check if a new data can be created", function() {
    it('should add a new data general public expenses', function() {
        browser.
        get("http://localhost:8080/#!/ui/v1/motogp");
        element.all(by.repeater('race in motogp')).then(function(getLista) {

            element(by.model('newMotogp.circuit')).sendKeys('Cheste');
            element(by.model('newMotogp.year')).sendKeys(2015);
            element(by.model('newMotogp.first')).sendKeys('Marquez');
            element(by.model('newMotogp.second')).sendKeys('Dovicioso');
            element(by.model('newMotogp.third')).sendKeys('Rins');
            element(by.model('newMotogp.crash')).sendKeys(3);



            element(by.id('add')).click();

            element.all(by.repeater('race in motogp')).then(function(getListaFinal) {

                expect(getListaFinal.length).toEqual(getLista.length + 1);
            });
        });
    });
});