// Global variables Here:
var siteName = document.getElementById("siteName");
var siteUrl = document.getElementById("siteUrl");
var submitBtn = document.getElementById("submitBtn");
var tableContent = document.getElementById("tableContent");
var updateBtnEle = document.getElementById("UpdateBtn");
var tableData = document.getElementById("tableData");
// declar this variable for use it in UpdateBtn() function:
var linkIndex;

// All links will push here:
var linksData = [];

// check local storage:
checkLocalStorage();

// Check the links data array if it is empty hide it:
function checkLinksData() {
  if (linksData.length === 0) {
    tableData.classList.add("d-none");
  } else {
    tableData.classList.remove("d-none");
  }
}
checkLinksData();

function validateInputs(input) {
  // check if the input id:
  var isName = input.id === "siteName";
  var isUrl = input.id === "siteUrl";

  // RegEx:
  var nameRegex = /^[a-zA-Z0-9\s]{3,}$/;
  var urlRegex =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

  var isValid = false;

  // Validate input type:
  if (isName) {
    isValid = nameRegex.test(input.value);
  } else if (isUrl) {
    isValid = urlRegex.test(input.value);
  }
  // Update input styles:
  if (input.value === "") {
    // if no inputs:
    input.classList.remove("is-valid", "is-invalid");
  } else if (isValid) {
    // valid input:
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
  } else {
    // invalid input:
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
  }
  // return validation result:
  return isValid;
}

// add Link:
function addLink() {
  var isNameValid = validateInputs(siteName);
  var isUrlValid = validateInputs(siteUrl);
  if (!isNameValid || !isUrlValid) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "The Site Name or URL is not valid.",
      footer: `<p class="text-start fw-semibold">
       <i class="fa-regular fa-circle-right text-danger"></i> The Site Name must contain at least 3 characters. 
        <br>
       <i class="fa-regular fa-circle-right text-danger"></i> The Site URL must be valid.</p>`,
    });
    return;
  }
  var link = {
    id: linksData.length,
    name: siteName.value,
    url: siteUrl.value,
  };
  linksData.push(link);
  displayLinks(linksData);
  updateInputsValue();
  setLocalStorage();
  Swal.fire({
    title: "Great work!",
    text: "You've successfully added a bookmark.",
    icon: "success",
    timer: 1000,
  });
}

// display links:
function displayLinks(arr) {
  var linksBox = ``;
  for (var i = 0; i < arr.length; i++) {
    linksBox += `
        <tr>
           <td scope="row" class="fw-semibold">${i + 1}</td>
            <td class="fw-semibold text-capitalize">${
              arr[i].highlightedName ? arr[i].highlightedName : arr[i].name
            }</td>              
            <td><button class="btn visit-btn btn-sm" onclick="visitLink('${
              arr[i].url
            }')" ><i class="icon-eye1  icon-btn"></i><i class="fa-solid fa-eye"></i></button></td>
            <td><button class="btn btn-danger  btn-sm"
                  onclick="deleteLink(${
                    arr[i].id
                  })" ><i class="fa-solid fa-trash"></i></button></td>
            <td><button class="btn btn-warning  btn-sm" onclick="setFormforUpdate(${i})"><i class="fa-solid fa-pen-to-square"></i></button></td>
        </tr>
        `;
  }
  tableContent.innerHTML = linksBox;
}

//  set to Local Storage:
function setLocalStorage() {
  localStorage.setItem("links", JSON.stringify(linksData));
}
//  check and get Local Storage:
function checkLocalStorage() {
  if (localStorage.getItem("links") != null) {
    linksData = JSON.parse(localStorage.getItem("links"));
    displayLinks(linksData);
  }
}

// update inputs value:
function updateInputsValue(value) {
  siteName.value = value ? value.name : "";
  siteUrl.value = value ? value.url : "";

  siteName.classList.remove("is-valid");
  siteUrl.classList.remove("is-valid");
}

// Delete function:
function deleteLink(linkId) {
  Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone.!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#9746cd",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      for (var i = 0; i < linksData.length; i++) {
        if (linksData[i].id === linkId) {
          linksData.splice(i, 1);
        }
      }

      setLocalStorage();
      checkLocalStorage();
      checkLinksData();

      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
        timer: 1000,
      });
    }
  });
}

//  visit link funciton:
function visitLink(url) {
  open(url, "_blank");
}

// Prepare inputs to update link:
function setFormforUpdate(index) {
  updateInputsValue(linksData[index]);
  submitBtn.classList.add("d-none");
  updateBtnEle.classList.remove("d-none");
  linkIndex = index;
}

//  Update product:
function UpdateBtn() {
  // validate:
  var isNameValid = validateInputs(siteName);
  var isUrlValid = validateInputs(siteUrl);
  if (!isNameValid || !isUrlValid) {
    Swal.fire({
      title: "Validation Error",
      text: "Please check your input fields.",
      icon: "error",
    });
    return;
  }

  linksData[linkIndex].name = siteName.value;
  linksData[linkIndex].url = siteUrl.value;

  setLocalStorage();
  displayLinks(linksData);
  updateInputsValue();

  submitBtn.classList.remove("d-none");
  updateBtnEle.classList.add("d-none");

  Swal.fire({
    title: "Updated!",
    text: "Bookmark has been updated successfully.",
    icon: "success",
    timer: 1000,
  });
}

// Search funciton :
function searchLinks(searchKey) {
  var SearchLinksArr = [];
  var originalLinks = JSON.parse(localStorage.getItem("links"));
  var regex = new RegExp(`(${searchKey})`, `gi`);

  for (var i = 0; i < originalLinks.length; i++) {
    var item = originalLinks[i];
    if (regex.test(item.name)) {
      SearchLinksArr.push(item);
    }

    item.highlightedName = item.name.replace(
      regex,
      (match) => `<span class="text-danger">${match}</span>`
    );
  }
  displayLinks(SearchLinksArr);
  localStorage.setItem("links", JSON.stringify(originalLinks));
}
