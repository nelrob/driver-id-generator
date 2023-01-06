var output = document.getElementById("output");
var idImage = document.getElementById("pic");
let name = document.getElementById("nameInput");
var dob = document.getElementById("DOB");
var expiry = document.getElementById("EXP");
const button = document.getElementById("generate");

button.addEventListener("click", async () => {
    console.log("%c\n\nStart of new generation", `font-size: 1.35em`);
    console.log("Button clicked function started");

    const details = await getDetails().then((res) => {
        console.log("response of getDetails() received");
        console.log("response: ", res);

        // * "Object destructuring": Syntax to quick extract values from an array and assign to variables
        let [ageValue, genderValue] = res;

        console.log(`genderValue: ${genderValue}`, `ageValue: ${ageValue}`);

        // Runs the promises
        getPicture(genderValue);
        setBirthDate(ageValue);
        setExpiryDate();
    });
});

// Trait object that stores the trait needed from each URL
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

async function getDetails() {
    console.log("Entered getDetails()");

    let name = nameInput.value;

    // * String array of trait properties (age, gender, nationality)
    let list = Object.keys(Traits);

    // * Put the requests in an <array.map()> function, not much different from a `forEach` loop
    // * This fills <requests[]> with the results of the fetch requests
    // * The values inside <requests[]> do not matter, we just need this for the Promise.all()
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
            .catch((err) => console.error(err)); // catch error
    });

  // * Promise.all() allows us to wait for all the fetch requests to finish before running the code
  // * This should ensure that this function will return the <results[]> array containing <ageValue> and <genderValue>
    return Promise.all(requests)
    .then(() => {
        if (name != "") {
            let ageValue = Traits.age.result;
            let genderValue = Traits.gender.result;
            let ntnValue = Traits.nationality.result;

            results = [ageValue, genderValue];

            console.log("Promise Results: ", results);

            output.innerHTML = `<p>Name: ${name}</p>
            <p>Age: ${ageValue}</p>
            <p>Sex: ${genderValue}</p>
            <p>Nationality: ${ntnValue}</p>
            <p>Class: <strong>B</strong>`; // output to card info

            return results;
        }
    })
    .catch((err) => console.error(err)); // catch error
}

async function getPicture(genderValue) {
    let request = `https://randomuser.me/api/?gender=` + genderValue;
    console.log(`getPictureGenderVal: ${genderValue}`);

    fetch(request, { method: "GET" })
    .then(function (response) {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        let idImageURL = data.results[0].picture.large;
        console.log(idImageURL);
        idImage.innerHTML = `<img src='${idImageURL}'></img>`; // output to card info
    });
}

async function setBirthDate(ageValue) {
    const today = new Date();
    today.setFullYear(today.getFullYear() - ageValue); // subtract age years to the current date
    const dateString = today.toLocaleDateString(); // convert to string

    dob.innerHTML = `DOB: <strong>${dateString}</strong>`; // output to card info
}

async function setExpiryDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() + 3); // add 3 years to the current date
    const dateString = today.toLocaleDateString(); // convert to string

    expiry.innerHTML = `EXP: <strong>${dateString}</strong>`; // output to card info
}
