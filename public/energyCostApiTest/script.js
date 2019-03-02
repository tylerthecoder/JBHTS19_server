const url = "https://developer.nrel.gov/api/utility_rates/v3.json?api_key=lZgLIACHh8UM8NQVROxPtUrbZWxoNaje3leasT70&lat=35.45&lon=-83.98";

async function queryApi() {

    const rawResponse = await fetch(url);
    const response = await rawResponse.json();
    console.log(response.outputs.commercial);
}