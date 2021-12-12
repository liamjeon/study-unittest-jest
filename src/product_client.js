class ProductClient{
    fetchItems(){
        return fetch('http://example.com/login/id+password').then((reponse)=>{
            response.json();
        });
    }
}

module.exports = ProductClient;