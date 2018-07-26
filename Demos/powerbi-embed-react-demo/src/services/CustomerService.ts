import ICustomer from "./../models/ICustomer";

export default class CustomerService {

  static getCustomers = (): Promise< ICustomer[]> => {
    const restUrl = "http://subliminalsystems.com/api/Customers/?$select=LastName,FirstName,CustomerId&$filter=(CustomerId+le+12)";
     return  fetch(restUrl)
        .then(response => response.json())
        .then(response=>{
          console.log(response.value);
          return response.value;
        });

     
  } 
}