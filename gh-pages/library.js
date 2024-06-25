
$(document).ready(function () {
    // Tab functionality
    $('#search-container .nav-button').click(function () {
        if (!$(this).hasClass("active")) {
            $('#search-container .nav-button').removeClass('active').attr('aria-selected', 'false');
            $(this).addClass('active').attr('aria-selected', 'true');
            var activeTab = $(this).data('target');
            $('#search-container .tab-pane').removeClass('show active');
            $(activeTab).addClass('show active');
        }
    });
    // Loads the JavaScript google api client library and invokes `start` afterwards.
    if (typeof gapi != "undefined") {
        gapi.load('client', start);
    }
    createCarousel();

});

function searchOneSearch() {
    document.getElementById("primoQuery").value = "any,contains," + document.getElementById("primoQueryTemp").value.replace(/[,]/g, " ");
    document.forms["onesearch"].submit();
}

function searchJournals() {
    document.getElementById("journalsPrimoQuery").value = "any,contains," + document.getElementById("journalsQueryTemp").value.replace(/[,]/g, " ");
    document.getElementById("journalsQuery").value = "any," + document.getElementById("journalsQueryTemp").value.replace(/[,]/g, " ");
    document.forms["journalssearch"].submit();
}

function start() {
    // Initializes the client with the API key and the Translate API.
    gapi.client.init({
        'apiKey': '',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
    }).then(function () {
        listUpcomingEvents();
    }, function (error) {
        appendError();
    })
};

function appendError() {
    var errorMessage = $('<p>Error: Today\'s hours are currently unavailable. Please check the link below for more details on our hours of operation.</p>');
    if ($('#hours').length) {
        $(errorMessage).hide().insertAfter('#hours').fadeIn();
    } else {
        $('h2').each(function (index) {
            if ($(this).text() == "Today's Hours") {
                $(errorMessage).hide().insertAfter(this).fadeIn();
            }
        });
    }
};

function listUpcomingEvents() {
    var now = new Date();
    gapi.client.calendar.events.list({
        'calendarId': 'fitnyc.edu_7tcer41iqofkait0qk6p9lk7a4@group.calendar.google.com',
        'timeMin': now.toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        var errorMessage = $('<p>Error: Today\'s hours are currently unavailable. Please check the link below for more details on our hours of operation.</p>');
        if (events.length > 0) {
            var today_events = [];
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                //all day events need to be set as begining of day eastern time
                // Get time zone offset and check for daylight savings
                const getEstOffset = () => {
                    const stdTimezoneOffset = () => {
                        var jan = new Date(0, 1)
                        var jul = new Date(6, 1)
                        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
                    }

                    var today = new Date(event.start.date)

                    const isDstObserved = (today) => {
                        return today.getTimezoneOffset() < stdTimezoneOffset()
                    }

                    if (isDstObserved(today)) {
                        return '-0400'
                    } else {
                        return '-0500'
                    }
                }
                var starting = new Date(event.start.date + 'T00:00:00.000' + getEstOffset());
                if (now.getFullYear() === starting.getFullYear() && now.getMonth() === starting.getMonth() && now.getDate() === starting.getDate()) {
                    today_events.push(event);
                }
            }
            if (today_events.length > 0) {
                today_events.sort((a, b) => (a.summary > b.summary) ? 1 : -1)
                var hours_list = $('<ul class="hours-list"></ul>');
                for (var i = 0; i < today_events.length; i++) {
                    hours_list.append('<li>' + today_events[i].summary + '</li>');
                }
                if ($('#hours').length) {
                    $(hours_list).hide().insertAfter('#hours').fadeIn();
                } else {
                    $('h2').each(function (index) {
                        if ($(this).text() == "Today's Hours") {
                            $(hours_list).hide().insertAfter(this).fadeIn();
                        }
                    });
                }

            } else {
                appendError()
            }

        } else {
            appendError()
        }
    }, function (error) {
        appendError();
    });
}

function carouselError() {
    if ($('#new-books').length) {
        $('#new-books').remove();
    } else {
        $('h2').each(function (index) {
            if ($(this).text() == "What's New?") {
                $(this).remove();
            }
        });
    }
}

function createCarousel() {
    fetch("https://fitnycdigitalinitiatives.github.io/onesearch-newbooks/new-books.json")
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 1) {
                let slickCarousel = $(`<div class="slick-carousel"></div>`);
                let slickContainer = $(`
                <div class="slick-container">
                    <div class="prev-column">
                        <button type="button" class="btn btn-green rounded-circle" id="previous">
                            <i class="fas fa-chevron-left"></i>
                            <span class="sr-only">Previous</span>
                        </button>
                    </div>
                    <div class="slick-column">
                    </div>
                    <div class="next-column">
                        <button type="button" class="btn btn-green rounded-circle" id="next">
                            <i class="fas fa-chevron-right"></i>
                            <span class="sr-only">Next</span>
                        </button>
                    </div>                    
                </div>
                `);
                var slides = [];
                $.each(data, function (i, book) {
                    if (book["cover-url"] != "") {
                        var slide = `
                    <a class="card" target="_top" href="` + book["onesearch-url"] + `" title="` + book["title"] + `">
                    <img src="` + book["cover-url"] + `" alt="` + book["title"] + `" class="card-img">
                    </a>
                    `
                    }
                    slides.push(slide);
                });
                slickCarousel.append(slides);
                slickCarousel.slick({
                    infinite: false,
                    dots: false,
                    arrows: false,
                    slidesToShow: 6,
                    slidesToScroll: 6,
                    responsive: [
                        {
                            breakpoint: 420,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2,
                            }
                        },
                        {
                            breakpoint: 576,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3
                            }
                        },
                        {
                            breakpoint: 700,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 4
                            }
                        },
                        {
                            breakpoint: 1025,
                            settings: {
                                slidesToShow: 5,
                                slidesToScroll: 5
                            }
                        }
                    ]
                });
                slickContainer.find(".slick-column").append(slickCarousel);
                if ($('#new-books').length) {
                    $(slickContainer).hide().insertAfter('#new-books').fadeIn();
                    slickCarousel.slick('setPosition');
                } else {
                    $('h2').each(function (index) {
                        if ($(this).text() == "What's New?") {
                            $(slickContainer).hide().insertAfter(this).fadeIn();
                            slickCarousel.slick('setPosition');
                        }
                    });
                }
                // Go to the next item
                $('#next').click(function () {
                    slickCarousel.slick('slickNext');
                });
                // Go to the previous item
                $('#previous').click(function () {
                    slickCarousel.slick('slickPrev');
                });
            } else {
                console.log("Not enough new books to make carousel.")
                carouselError();
            }
        })
        .catch((error) => {
            console.log(error);
            carouselError();
        });
}