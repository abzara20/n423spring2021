function getData() {
    // to get the json, from jquery documentation we put the local path in the first argument, then an anonymous function
    $.getJSON("../data/data.json", function(data){
        // console.log(data);
        // console.log(data.Students[0].studentName);

        $.each(data.Students, function(idx, student){
            $("#content").append(`<div>
                <p>Name: ${student.studentName}</p>
                <p>GPA: ${student.studentGPA}</p>
                <p>Address: ${student.studentAddress.streetNumber}<br />
                ${student.studentAddress.city}
                ${student.studentAddress.state}
                ${student.studentAddress.zipcode}</p>
            </div>
            `);

            // console.log(student.studentName);
            // console.log(student.studentGPA);
            // console.log(student.studentAddress.streetNumber);
            // console.log(student.studentAddress.city);
            // console.log(student.studentAddress.state);
            // console.log(student.studentAddress.zipcode);
        });

    }).fail(function(error){
        console.log("hi", error.status);
    });
}

function getWeather(zip){
    $.get(
        `http://api.weatherapi.com/v1/current.json?key=b2401d84f56a456db04203011211309&q=${zip}&aqi=no`, function(data){
            console.log(data.current.condition.icon);
            $("#content #wInfo").html(`<img src="${data.current.condition.icon}" />`)
        }).fail(function(e){
            console.log(e)
        });
}

function setBindings(){
    $("#submit").click(function (e){
        // stops page from reloading
        e.preventDefault();
        // let zipInput = document.getElementById("zipcode").value;
        let zipInput = $("#zipcode").val();
        console.log(zipInput);
        getWeather(zipInput);
    });
}

$(document).ready( function (){
    // getData();
    // getWeather();
    setBindings();
})