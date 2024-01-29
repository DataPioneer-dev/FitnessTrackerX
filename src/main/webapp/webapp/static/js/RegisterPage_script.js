document.addEventListener("DOMContentLoaded", function () {
    var dateInput = document.getElementById("birthdayText");

    dateInput.addEventListener("input", function () {
        if (dateInput.value) {
            dateInput.style.color = "green";
        } else {
            dateInput.style.color = "gray";
        }
    });
});

