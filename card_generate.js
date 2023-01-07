const button = document.getElementById("generate");
button.addEventListener("click", async () => {
    console.log("%c\n\nStart of new generation", `font-size: 1.35em`);
    console.log("Button clicked function started");

    // Runs getDetails() and waits for that its results to proceed with remaining promises
    const details = await getDetails().then((res) => {
        console.log("response of getDetails() received");
        console.log("response: ", res);

        let [ageValue, genderValue] = res;

        console.log(`genderValue: ${genderValue}`, `ageValue: ${ageValue}`);

        // Runs remaining promises
        getPicture(genderValue);
        setBirthDate(ageValue);
        setExpiryDate();
    });
});

// * Trait object that stores the trait needed from each URL
let Traits = {
    age: {
        url: "agify",
        traitName: "age",
        result: "",
    },
    gender: {
        url: "genderize",
        traitName: "gender",
        result: "",
    },
    nationality: {
        url: "nationalize",
        traitName: "country:0:country_id",
        result: "",
    },
};

// Parses the traitName property to figure out where to get the value from
function getTraitVal(string, object) {
    let result = string.split(":").reduce(function (obj, prop) {
        return obj && obj[prop];
    }, object);
    return result;
}

// Makes first 3 API calls for age, gender, nationality 
async function getDetails() {
    console.log("Entered getDetails()");
    let nameInput = document.getElementById("nameInput");
    let name = nameInput.value;

    // * String array of trait properties (age, gender, nationality)
    let list = Object.keys(Traits);

    // * Array map that iterates through traits - fills <requests[]> with the results of the fetch requests
    let requests = list.map(async (trait) => {
        console.log(`<${trait}> request being made`);

        let url = Traits[trait].url;
        let request = `https://api.${url}.io?name=${name}`;

        // Makes the API call
        return fetch(request, { method: "GET" })
            .then(function (response) {
                return response.json(); 
            })
            .then((data) => {
                console.log("Data: ", data);

                // Saves result inside the <Traits> object
                Traits[trait].result = getTraitVal(Traits[trait].traitName, data);

                console.log("Result: ", Traits[trait].result);
            })
            // Catch error
            .catch((err) => console.error(err)); 
    });

    // * Waits for all the fetch requests to finish before running the code
    // * Ensures this function will return the <results[]> array containing <ageValue> and <genderValue>
    return Promise.all(requests)
    .then(() => {
        if (name != "") {
            let ageValue = Traits.age.result;
            let genderValue = Traits.gender.result;
            let ntnValue = Traits.nationality.result;

            results = [ageValue, genderValue];

            console.log("Promise Results: ", results);

            // Output name, gender, nationality to card info
            document.getElementById("NAME").innerHTML = `${name}`;
            document.getElementById("SEX").innerHTML = `${genderValue}`;
            document.getElementById("NTN").innerHTML = `${ntnValue}`;

            return results;
        }
    })
    // Catch error
    .catch((err) => console.error(err)); 
}

// Generates ID image with genderValue from getDetails()
async function getPicture(genderValue) {
    let request = `https://randomuser.me/api/?gender=` + genderValue;
    console.log(`getPictureGenderVal: ${genderValue}`);

    // Makes the API call
    fetch(request, { method: "GET" })
    .then(function (response) {
        return response.json();
    })
    .then((data) => {
        console.log(data);

        var idImage = document.getElementById("driverImage");

        // Gets image URL and outputs to card info
        let idImageURL = data.results[0].picture.large;
        console.log(idImageURL);
        idImage.src = `${idImageURL}`;
    });
}

// Generates DOB field
async function setBirthDate(ageValue) {
    var dob = document.getElementById("DOB");
    
    const today = new Date();
    // Subtracts age years from current date and convert to string
    today.setFullYear(today.getFullYear() - ageValue);
    const dateString = today.toLocaleDateString();

    // Outputs to card info
    dob.innerHTML = `${dateString}`; 
}

// Generates EXP field
async function setExpiryDate() {
    var expiry = document.getElementById("EXP");

    const today = new Date();
    // Subtract age years from current date and convert to string
    today.setFullYear(today.getFullYear() + 3); 
    const dateString = today.toLocaleDateString();

    // Outputs to card info
    expiry.innerHTML = `${dateString}`; 
}