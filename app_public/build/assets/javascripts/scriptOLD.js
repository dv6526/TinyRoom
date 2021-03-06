class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    add(vector_to_add) {
        this.x += vector_to_add.x;
        this.y += vector_to_add.y;
        return this;
    }

    subtract(vector_to_subtract) {
        this.x -= vector_to_subtract.x;
        this.y -= vector_to_subtract.y;
        return this;
    }

    normalize() {
        var length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
    }

    multiply(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    clone() {
        return new Vector(this.x, this.y);
    }
}

var mutedPlayers = [];
var globalMutes = [];

// UTILITY FUNCTIONS =======================================
const regPass = /^.{3,}$/;
const regEmail = /^\S+@\S+$/;
const regName = /^[a-zA-Z0-9]{1,10}$/;

// check profile password
/*
function checkPassword(dogodek) {
    let password = document.getElementById('password');
    let info = document.getElementById("passwordInfo");
    if (!regPass.test(password.value)) {
        info.innerText = "Password is too short";
        dogodek.preventDefault();
        return;
    }
}

// check profile info
function checkProfileInfo(dogodek) {
    let biotitle = document.getElementById("biotitle");
    let bio = document.getElementById('bio')
    biotitle.value = biotitle.value.substring(0, 20);
    bio.value = bio.value.substring(0, 200);
    if (biotitle.value == "") {
        biotitle.value = "Default bio title";
    }
    if (bio.value == "") {
        bio.value = "This is default bio";
    }
}
*/

function orangeObroba() {
    var message = document.getElementById("message");
    var last_color = message.style.borderColor;
    message.style.borderColor = "orange";

    function setBack() {
        message.style.borderColor = last_color;
        document.getElementById("messagesend").removeEventListener("click", setBack);
    }

    document.getElementById("messagesend").addEventListener("click", setBack);
}

//js za pojavno okno
function topAlert(message, seconds) {
    var okno = document.createElement('div');
    okno.textContent = message;
    okno.className = 'message-bubble modalnoOkno';
    document.body.appendChild(okno);

    var cas = setTimeout(function () { okno.remove(); }, seconds * 1000);
}

// check login
function checkLoginInfo(dogodek) {
    let username = document.getElementById("username")
    let password = document.getElementById('password');
    let info = document.getElementById("loginInfo");
    if (!regName.test(username.value)) {
        info.innerText = "Username does not fit the specification";
        dogodek.preventDefault();
        return;
    }
    if (!regPass.test(password.value)) {
        info.innerText = "Password does not fit the specification";
        dogodek.preventDefault();
        return;
    }
}

// check register
function checkRegisterInfo(dogodek) {
    console.log(this);
    // preveri pravilno vnosa imena in gesla
    let email = document.getElementById('email');
    let name = document.getElementById('usernameRegister');
    let password = document.getElementById('passwordRegister');
    let info = document.getElementById("registerInfo");

    if (!regEmail.test(email.value)) {
        info.innerText = "Email address has a typo";
        dogodek.preventDefault();
        return;
    }
    if (!regName.test(name.value)) {
        info.innerText = "Username should consist only of letters or numbers";
        dogodek.preventDefault();
        return;
    }
    if (!regPass.test(password.value)) {
        info.innerText = "Password is too short";
        dogodek.preventDefault();
        return;
    }
}

function returnImageObject(image_link, onload) {
    var img = document.createElement('img');
    img.src = image_link;
    img.onload = onload;
    return img;
}

function getCanvasMousePos(evt, canvas) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(
        evt.clientX - rect.left,
        evt.clientY - rect.top
    );
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


// new message
function novoSporocilo(sporocilo_info) {
    var sporocilo = document.createElement("div");
    sporocilo.classList.add("message-bubble");
    sporocilo.setAttribute("data-username", sporocilo_info.sender);

    if (sporocilo_info.player == true) {
        sporocilo.classList.add("player");
    }

    if (!sporocilo_info.private_message) {
        sporocilo.textContent = ((sporocilo_info.date) + " " + (sporocilo_info.sender) + ": " + (sporocilo_info.body));
    }
    else {
        sporocilo.classList.add("private");
        if (sporocilo_info.recipient) {
            sporocilo.textContent = ((sporocilo_info.date) + " " + (sporocilo_info.sender) + " => " + (sporocilo_info.recipient) + ": " + (sporocilo_info.body));
        }
        else {
            sporocilo.textContent = ((sporocilo_info.date) + " " + (sporocilo_info.sender) + ": " + (sporocilo_info.body));
        }
    }

    document.querySelector("#chatlogs").prepend(sporocilo);
}

function messageDropdown(screenPosition, dropdown_info, chat) {
    // MessageDropdown
    function dropdownReset() {
        if (document.getElementById("dropdown")) {
            document.getElementById("dropdown").remove();
            setTimeout(function () {
                chat.dropdown_active = false;
            }, 0.5)
        }
    }

    function dropdownButtonClick(option) {
        console.log(option.target.innerHTML);
        switch (option.target.innerHTML) {
            case "room invite":
                chat.allowPlayer(dropdown_info.username);
                break;
            case "join room":
                chat.socket.send("JO " + JSON.stringify({
                    "username": dropdown_info.username
                }));
                break;
            case "leave room":
                chat.socket.send("JO " + JSON.stringify({
                    "username": undefined
                }));
                break;
            case "mute":
                chat.socket.send("MU " + JSON.stringify({
                    "username": dropdown_info.username
                }));
                mutedPlayers.push(dropdown_info.username);
                break;
            case "unmute":
                chat.socket.send("UN " + JSON.stringify({
                    "username": dropdown_info.username
                }));
                mutedPlayers = mutedPlayers.filter(player => player !== dropdown_info.username);
                break;
            case "global mute":
                chat.socket.send("GM " + JSON.stringify({
                    "username": dropdown_info.username
                }));
                globalMutes.push(dropdown_info.username);
                break;
            case "global unmute":
                chat.socket.send("GU " + JSON.stringify({
                    "username": dropdown_info.username
                }));
                globalMutes = globalMutes.filter(player => player !== dropdown_info.username);
                break;
            case "enter room":
                chat.socket.send("ER " + JSON.stringify({
                    "username": dropdown_info.username
                }));
                break;
            case "warn":
                chat.socket.send("WA " + JSON.stringify({
                    "username": dropdown_info.username
                }));
                break;
            case 'kick':
                chat.socket.send("KI " + JSON.stringify({
                    "username": dropdown_info.username
                }));
                break;
            case 'private message':
                chat.setPrivateMSG(dropdown_info.username);
                break;
            default:
                break;
        }
        dropdownReset();
        //option handler
    }

    // reset in case of two consecutive right clicks
    dropdownReset();

    // init
    let dropdown = document.createElement("div");
    let dropdown_nav = document.createElement("ul");
    let row = document.createElement("li");
    let link = document.createElement("a");
    let options = [["mute", "unmute"], "room invite", ["join room", "leave room"], "private message",
    ["global mute", "global unmute"], "warn", "kick", "enter room"];
    let optionsLength = (dropdown_info.rank == "admin") ? options.length : 4;
    /*
        Construct dropdown
    */
    //dropdown.style.width = "400px";
    // Append buttons to div (user and admin are different)
    dropdown.id = "dropdown";
    dropdown_nav.id = "dropdown_nav";                               // set ID for removal of dropdown
    dropdown_nav.className = "nav flex-columns";                 // bootstrap
    for (let i = 0; i < optionsLength; i++) {
        //row = document.createElement("li");
        link = document.createElement("a");                         // has to be reinitialized every time
        row.className = "nav-item";                                   // bootstrap
        link.className = "nav-link pt-0 pb-0";                      // bootstrap
        //link.addEventListener("click", dropdownButtonClick);      // add event listener on click (left in case eventlistener on div is harder to handle)

        // append childs to parents (look out for mute/unmute, global mute/unmute)
        if (i == 0)
            link.appendChild(document.createTextNode((dropdown_info.muted) ? options[i][1] : options[i][0]));
        else if (i == 4)
            link.appendChild(document.createTextNode((dropdown_info.g_muted) ? options[i][1] : options[i][0]));
        else if (i == 2) {
            link.appendChild(document.createTextNode((chat.room == undefined) ? options[i][0] : options[i][1]));
        }
        else
            link.appendChild(document.createTextNode(options[i]));
        row.appendChild(link);
        dropdown_nav.appendChild(row);
    }
    dropdown.appendChild(dropdown_nav);

    // Append profile information to div
    // {'bio_pic':'imagesrc', 'bio_title': 'This is my title', 'bio_description': 'I am to lazy to change my bio description'}
    let profile = document.createElement("div");
    let picture = document.createElement("img");
    let title = document.createElement("h5");
    let description = document.createElement("div");
    profile.id = "dropdown_profile";

    // picture
    picture.src = dropdown_info.bio_pic;
    picture.alt = "Profile Picture not found or cannot be shown";
    picture.style.width = "170px";
    picture.style.height = "170px";
    picture.style.objectFit = 'cover';
    // bio title (uppercased)
    title.appendChild(document.createTextNode(dropdown_info.bio_title.toUpperCase()));
    title.className = "text-center";
    // bio description
    description.className = "";
    description.append(document.createTextNode(dropdown_info.bio_description));
    description.className = "p-2";
    description.style.fontSize = "12px"

    // append everything
    profile.append(picture);
    profile.append(title);
    profile.append(description);

    dropdown.append(profile);
    document.body.appendChild(dropdown);

    // add event listener on click
    function click_handler(click) {
        if ($(click.target).parents('#dropdown').length && click.target.classList.contains('nav-link')) {
            dropdownButtonClick(click);
        }

        else {
            dropdownReset();
        }
        document.removeEventListener("click", click_handler);
    }

    document.addEventListener("click", click_handler);


    // Opens dropdown on x,y position
    // check if clicked closer to the edge than allowed
    /*
    if((screenPosition.x + dropdown.offsetHeight) > $(document).height())
        dropdown.style.top = ($(document).height() - dropdown.offsetHeight - 1) + "px";
    else
        dropdown.style.top = screenPosition.y + "px";

    if((screenPosition.y + dropdown.offsetWidth) > $(document).width())
        dropdown.style.left = ($(document).width() - dropdown.offsetWidth - 1) + "px";
    else
        dropdown.style.left = screenPosition.x + "px";
    */
    dropdown.style.top = screenPosition.y + "px";
    dropdown.style.left = screenPosition.x + "px";

    // Close dropdown if clicked anywhere else on the screen
    // klic dropdownButtonClick(brez opcije) ali dropdownReset()
    // PRI RESIZE-U OKNA SKRIJ DIV (klic dropdownReset()), ker se ne premika skladno in bo potem postavljen kr nekje

    // HTML okno mora imeti atribut data-user_id z vrednostjo target_user_id
    // ne vem to??no kaj naj bi to pomenilo. Predvidevam, da mora imeti ta atribut message-bubble.
}

function openSearchField(screenPosition, chat) {

    function closeSearchField() {
        if (document.getElementById("search-box")) {
            document.getElementById("search-box").remove();
            setTimeout(function () {
                chat.searchField_active = false;
            }, 0.5)
        }
    }

    closeSearchField();

    // create search Field
    var searchBox = document.createElement("div");
    var searchField = document.createElement("input");

    searchBox.id = "search-box";

    searchField.id = "search-field";
    searchField.className = "input-sm";
    searchField.setAttribute("type", "text");
    searchField.setAttribute("name", "search-field");
    searchField.setAttribute("placeholder", "Search");

    searchField.onkeyup = function (event) {

        var matching_players = chat.users.filter(u => u.getName().includes(searchField.value));
        if (matching_players.length == 1 && !matching_players.includes(chat.player)) {
            if (event.key != 'Backspace') {
                searchField.value = matching_players[0].getName();
                chat.player.setWantedPos(matching_players[0].getWantedPos().clone().add(new Vector(Math.floor(Math.random() * 101) - 50, Math.floor(Math.random() * 101) - 50)));
                chat.sendPosition();
            }
        }

        if (event.key == 'Enter') {
            matching_players = chat.users.filter(u => u.getName() == searchField.value);
            chat.player.setWantedPos(matching_players[0].getWantedPos().clone().add(new Vector(Math.floor(Math.random() * 101) - 50, Math.floor(Math.random() * 101) - 50)));
            chat.sendPosition();
        }

    }

    searchBox.appendChild(searchField);

    document.body.appendChild(searchBox);

    searchBox.style.top = screenPosition.y + "px";
    searchBox.style.left = screenPosition.x + "px";

    // closing on left click
    function click_handler(click) {
        if (!$(click.target).closest("#search-box").length) {
            closeSearchField();
            document.removeEventListener("click", click_handler);
        }
    }

    document.addEventListener("click", click_handler);
}

// END OF UTILITY FUNCTIONS ================================

class User {

    constructor(position, name, weather, sprite_idx) {
        this.sprite_wh = 30;
        this.position = position;
        this.wanted_position = position;
        this.name = name;
        this.weather = weather;
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.sprite_wh;
        this.canvas.height = this.sprite_wh;
        this.sprite_idx = sprite_idx;

        this.draw_avatar();

    }

    setWantedPos(pos) {
        this.wanted_position = pos;
    }

    getWantedPos() {
        return this.wanted_position;
    }

    setPosition(pos) {
        this.position = pos;
    }

    getPosition() {
        return this.position;
    }

    getWeather() {
        return this.weather;
    }

    getName() {
        return this.name;
    }

    draw_avatar() {
        var user = this;
        var img = returnImageObject('/assets/images/sprites.png', function () {
            user.context.drawImage(img, user.sprite_idx * 30, 0, 30, 30, 0, 0, user.sprite_wh, user.sprite_wh);
        });
    }

    step() {
        const speed = 5;
        const slowdown_distance = 100;
        const treshold = 2;
        // treshold for when to stop moving
        var vectorToWanted = this.wanted_position.clone().subtract(this.position);
        var distanceToWanted = vectorToWanted.length();

        if (distanceToWanted > treshold) {
            vectorToWanted.normalize().multiply(
                Math.min(
                    Math.min(speed * (distanceToWanted / slowdown_distance), speed),
                    distanceToWanted
                )
            );
            this.position.add(vectorToWanted);
        }

    }

}

class Furniture {
    constructor(type, position) {
        this.type = type;
        this.position = position;
    }

    setPosition(position) {
        this.position = position;
    }
}

class Chat {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);

        if (this.canvas != null) {
            // server communications
            this.socket = undefined;

            this.context = this.canvas.getContext('2d');
            // all users without logged in user
            this.users = [];
            // logged in user
            this.player;
            this.room = undefined;

            this.private_message = false;
            this.private_message_recepient = undefined;

            // furniture
            this.furniture = [];
            // furniture assets
            this.assets = {
                "fotelj": { img: returnImageObject('/assets/editor/fotelj.png', null), scale: 1.4 },
                "stol": { img: returnImageObject('/assets/editor/stol.png', null), scale: 1.4 },
                "stolcek": { img: returnImageObject('/assets/editor/stolcek.png', null), scale: 1.4 },
                "light": { img: returnImageObject('/assets/editor/light.png', null), scale: 1.4 },
                "weather": returnImageObject('/assets/images/weather.png', null)
            };

            // set up background drawing offset
            this.background_clear_color = '#387eb4';
            this.background_width = 2000;
            this.background_height = undefined;
            this.background_size = new Vector();
            this.background_center = new Vector(0.42, 0.36); // from 0 to 1, percentage
            this.offset = undefined;

            this.dropdown_active = false;
            this.searchField_active = false;

            var chat = this;
            // set up background
            this.background = returnImageObject('/assets/images/map.png', function () {
                // this executes when the background loads
                // set background center to center of screen
                // calculate ratio
                var ratio = chat.background.width / chat.background.height;
                // set height
                chat.background_height = chat.background_width / ratio;

                chat.offset = new Vector(
                    chat.background_width * chat.background_center.x - chat.canvas.width / 2,
                    chat.background_height * chat.background_center.y - chat.canvas.height / 2
                );

                // Add Player
                chat.addPlayer();

                // Start drawing
                chat.drawLoop();

                // add event listeners for interacting
                chat.hookControls();

                // start connection
                chat.communications();
            });
        }


    }

    changeBackground(background) {
        var backgrounds = {
            "map": {
                'file': '/assets/images/map.png',
                'width': 2000,
                'center': {
                    'x': 0.42,
                    'y': 0.36
                },
                'clear_color': '#387eb4'
            },
            "room": {
                'file': '/assets/editor/room.png',
                'width': 400,
                'center': {
                    'x': 0.5,
                    'y': 0.5
                },
                'clear_color': '#f2e1d6'
            }
        }

        this.background_clear_color = backgrounds[background].clear_color;

        this.background_width = backgrounds[background].width;
        this.background_center = new Vector(backgrounds[background].center.x, backgrounds[background].center.y);

        var chat = this;
        // set up background
        this.background = returnImageObject(backgrounds[background].file, function () {
            // this executes when the background loads
            // set background center to center of screen
            // calculate ratio
            var ratio = chat.background.width / chat.background.height;
            // set height
            chat.background_height = chat.background_width / ratio;

            chat.offset = new Vector(
                chat.background_width * chat.background_center.x - chat.canvas.width / 2,
                chat.background_height * chat.background_center.y - chat.canvas.height / 2
            );

            chat.player.setPosition(new Vector(chat.background_width * chat.background_center.x, chat.background_height * chat.background_center.y));
            chat.player.setWantedPos(new Vector(chat.background_width * chat.background_center.x, chat.background_height * chat.background_center.y));
            chat.sendPosition();
        });
    }

    addUser(player, isPlayer) {
        // player ... user object
        // isPlayer ... boolean, is added user the logged in user?
        this.users.push(player);
        if (isPlayer) {
            this.player = player;
        }
    }

    addPlayer() {
        // default spawn position
        var position = new Vector(600, 600);
        var name = username;
        // default weather

        var player = new User(position, name, weather, sprite_idx);
        this.addUser(player, true);
    }

    resize(width) {
        if (this.canvas) {
            this.canvas.style.width = '95%';
            this.canvas.style.height = '95%';
            this.canvas.width = 0.95 * width;
            this.canvas.height = this.canvas.width;
        }
    }

    inMap(position) {
        if (position.x <= this.canvas.width && position.y <= this.canvas.height && 0 <= position.x && 0 <= position.y) {
            return true;
        }
        return false;
    }

    sendPosition() {
        if (this.socket.readyState == 1) { // ker nam chrome me??e napako
            this.socket.send("PO " + JSON.stringify(this.player.getWantedPos()));
        } else {
            console.log("Socket is closed or closing. Couldn't send data!");
        }
    }

    setPrivateMSG(recipient) {
        orangeObroba();
        this.private_message = true;
        this.private_message_recepient = recipient;
    }

    hookControls() {
        var chat = this;
        // move handler
        document.addEventListener('click', function (click) {
            var position = getCanvasMousePos(click, chat.canvas);
            if (chat.inMap(position) && !chat.dropdown_active && !chat.searchField_active) {
                var wanted_position = position.clone().add(chat.offset);
                chat.player.setWantedPos(wanted_position);
                // communicate with server
                chat.sendPosition()
            }
        });

        document.addEventListener('contextmenu', function (click) {
            var position = getCanvasMousePos(click, chat.canvas);
            if (chat.inMap(position)) {
                click.preventDefault();

                // get player underneath mouse
                const treshold = 40;

                var found = false;
                var found_user = '';
                for (let i = 0; i < chat.users.length; i++) {
                    const user = chat.users[i];

                    if (user.getPosition().clone().subtract(chat.offset).subtract(position).length() <= treshold) {
                        found = true;
                        found_user = user.getName();
                    }
                }

                if (found) {
                    chat.dropdown_active = true;
                    var isMuted = false;
                    if (mutedPlayers.includes(found_user)) {
                        isMuted = true;
                    }
                    //getProfileInfo
                    $.ajax({
                        //url: "http://localhost:4000/api/uporabniki/" + found_user + "/profile", success: function (result) {
                        url: "/api/uporabniki/" + found_user + "/profile", success: function (result) {
                            //console.log(result);

                            messageDropdown({ x: click.clientX, y: click.clientY }, {
                                'rank': rank,
                                'muted': isMuted,
                                'g_muted': globalMutes.includes(found_user),
                                'target_user_id': 12,
                                'username': found_user,
                                'bio_pic': 'profileImages/' + found_user + '.' + result.profile_picture,
                                'bio_title': result.bio_title,
                                'bio_description': result.bio
                            }, chat);
                        }
                    });


                }

                else {
                    if (!chat.searchField) {
                        chat.searchField_active = true;
                        openSearchField({ x: click.clientX, y: click.clientY }, chat);
                    }
                }

            }
        });

        document.getElementById("messagesend").addEventListener('click', function () {
            var message = document.getElementById("message");

            var to_send = {
                "message": message.value
            }

            if (chat.private_message && message.value.length > 0) {
                var date = new Date();
                novoSporocilo({
                    sender: chat.player.getName(),
                    body: message.value,
                    date: addZero(date.getHours()) + ':' + addZero(date.getMinutes()),
                    player: true,
                    private_message: true,
                    recipient: chat.private_message_recepient
                })

                console.log("private message sent");

                message.value = "";
                to_send["recipient"] = chat.private_message_recepient;

                chat.socket.send("PM " + JSON.stringify(to_send));
            }

            else {
                if (message.value.length > 0) {
                    var date = new Date();
                    novoSporocilo({
                        sender: chat.player.getName(),
                        body: message.value,
                        date: addZero(date.getHours()) + ':' + addZero(date.getMinutes()),
                        player: true,
                        private_message: false
                    })

                    message.value = "";

                    chat.socket.send("MS " + JSON.stringify(to_send));
                }
            }

            chat.private_message = false;

        });
    }

    centerOnPlayer() {
        var left_upper_corner = this.offset;
        var right_bottom_corner = this.offset.clone().add(new Vector(this.canvas.width, this.canvas.height));
        var canvas_center = this.offset.clone().add(new Vector(this.canvas.width / 2, this.canvas.height / 2));
        var player_position = this.player.position;
        // check if player is close to border, move if he is
        const treshold = Math.min(250, this.canvas.width / 2 - 50);
        const move_speed = 2.5;
        // calculate distances from border
        // top, right, bottom, left
        const distances = [
            player_position.y - left_upper_corner.y,
            right_bottom_corner.x - player_position.x,
            right_bottom_corner.y - player_position.y,
            player_position.x - left_upper_corner.x
        ]

        if (Math.min(...distances) < treshold) {
            // player is close to the border
            // calculate vector to center map
            var vectorToMove = canvas_center.subtract(player_position);
            var distance = vectorToMove.length();
            var direction = vectorToMove.normalize();
            // finally move the offset
            this.offset.subtract(direction.multiply(Math.min(move_speed, distance)));
        }
    }

    drawName(text, x, y) {
        this.context.font = '20px Sans-serif';
        var textWidth = this.context.measureText(text).width;
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 3;
        this.context.strokeText(text, x - textWidth / 2, y - 35);
        this.context.fillStyle = 'white';
        this.context.fillText(text, x - textWidth / 2, y - 35);
    }

    drawWeather(type, x, y) {
        var dict = {
            "Clear": 0,
            "Clouds": 3,
            "Rain": 1,
            "Drizzle": 1,
            "Thunderstorm": 4,
            "Snow": 2
        };
        var widx = dict[type];

        this.context.drawImage(this.assets.weather, widx * 19, 0, 19, 19, x - 30, y - 95, 60, 60);
    }

    drawLoop() {
        // Da lahko uporabimo v loopu
        var chat = this;
        var context = chat.context;

        // drawing settings
        const avatar_size = 60;

        function loop() {
            // Prvo pobrisemo
            context.imageSmoothingEnabled = false;
            context.fillStyle = chat.background_clear_color;
            context.fillRect(0, 0, chat.canvas.width, chat.canvas.height);
            // move offset towards player
            chat.centerOnPlayer();
            context.drawImage(chat.background, -chat.offset.x, -chat.offset.y, chat.background_width, chat.background_height);

            // draw furniture
            for (let i = 0; i < chat.furniture.length; i++) {
                const furnitureObject = chat.furniture[i];
                const furniture = chat.assets[furnitureObject.type];
                context.drawImage(furniture.img, furnitureObject.position.x - chat.offset.x, furnitureObject.position.y - chat.offset.y, furniture.img.width * furniture.scale * (4 / 5), furniture.img.height * furniture.scale * (4 / 5));
            }

            // draw users
            for (let i = 0; i < chat.users.length; i++) {
                var user = chat.users[i];

                user.step();

                // draw user name
                chat.drawName(user.getName(), user.position.x - chat.offset.x, user.position.y - chat.offset.y);
                // draw user avatar
                context.drawImage(user.canvas, user.position.x - chat.offset.x - avatar_size / 2, user.position.y - chat.offset.y - avatar_size / 2, avatar_size, avatar_size);
                // draw weather
                chat.drawWeather(user.getWeather(), user.position.x - chat.offset.x, user.position.y - chat.offset.y);
            }

        }

        setInterval(function () {
            loop();
        }, 16.666);
    }

    allowPlayer(to_allow) {
        console.log("allowed", to_allow)
        this.socket.send("AL " + JSON.stringify({
            "username": to_allow
        }));
    }

    fillRoom(username_to_join) {

        //var position = room_details.position;
        //var type = room_details.type;
        //loop through objects in room_details
        var furniture = this.furniture;
        var room = this;
        $.ajax({
            type: "GET",
            //url: 'http://localhost:4000/api/privateRoom/' + username_to_join,
            url: '/api/privateRoom/' + username_to_join,
            contentType: 'application/json',
            success: function (result, status, xhr) {
                console.log(result);
                for (var i = 0; i < result.objects.length; i++) {
                    var room_object = result.objects[i];
                    var position = room_object.position;
                    position.x += 0.5;
                    position.y += 0.5;
                    position.x *= 400;
                    position.y *= 400;
                    furniture.push(new Furniture(room_object.type, new Vector(position.x, position.y)));

                }
            }
        });
    }

    clearRoom() {
        this.furniture = [];
    }

    joinRoom(username_to_join) {
        this.room = username_to_join;

        console.log("joined", username_to_join)
        // zbrisimo vse druge players iz players arraya
        // sebe ne

        this.users = [];
        this.users.push(this.player);

        if (username_to_join) {
            this.changeBackground('room');
            this.fillRoom(username_to_join);
        }
        else {
            this.changeBackground('map');
            this.clearRoom();
        }
    }

    communications() {
        this.socket = new WebSocket("ws://localhost:8070");
        //this.socket = new WebSocket("ws://157.245.36.23:8070");

        var chat = this;

        this.socket.onopen = function (event) {
            // we need to identify ourselves to the server
            // prepare json
            var identification = {
                "username": chat.player.getName(),
                "token": ws_token,
                "weather": weather
            }

            chat.socket.send("ID " + JSON.stringify(identification));
            console.log("Socket started!");
        }

        this.socket.onmessage = function (event) {
            const msg = event.data;

            //console.log("msg", msg);

            var command = msg.substr(0, 2);
            var command_data = JSON.parse(msg.substr(3));

            switch (command) {
                case 'LI':
                    // all players in room
                    chat.joinRoom(command_data["room"]);
                    var players = command_data["players"];

                    for (let i = 0; i < players.length; i++) {
                        const player = players[i];
                        var player_to_add = new User(undefined, player["username"], player["weather"], player["skin"]);
                        var pos = new Vector(player["position"]["x"], player["position"]["y"]);
                        player_to_add.setWantedPos(pos);
                        player_to_add.setPosition(pos);
                        chat.addUser(player_to_add, false);
                    }

                    break;
                case 'PO':
                    // position update
                    var position = command_data["position"];

                    for (let i = 0; i < chat.users.length; i++) {

                        const user = chat.users[i];

                        if (user.getName() == position["username"]) {
                            var position = position["position"];
                            user.setWantedPos(new Vector(position["x"], position["y"]));
                            break;
                        }
                    }

                    break;
                case 'JO':

                    // player joined the room
                    var player = command_data["player"];
                    console.log(player);
                    var player_to_add = new User(undefined, player["username"], player["weather"], player["skin"]);
                    var pos = new Vector(player["position"]["x"], player["position"]["y"]);
                    player_to_add.setWantedPos(pos);
                    player_to_add.setPosition(pos);
                    chat.addUser(player_to_add, false);

                    break;
                case 'LE':
                    // player left the room
                    var user_that_left = command_data["username"];
                    chat.users = chat.users.filter(user => user.getName() !== user_that_left);
                    break;
                case 'MS':
                    var date = new Date();
                    novoSporocilo({
                        sender: command_data["username"],
                        body: command_data["message"],
                        date: addZero(date.getHours()) + ':' + addZero(date.getMinutes()),
                        player: false,
                        private_message: false
                    })
                    break;
                case 'PM':
                    var date = new Date();
                    novoSporocilo({
                        sender: command_data["username"],
                        body: command_data["message"],
                        date: addZero(date.getHours()) + ':' + addZero(date.getMinutes()),
                        player: false,
                        private_message: true
                    })
                    break;
                case 'GM':
                    globalMutes.push(command_data["username"]);
                    break;
                case 'GU':
                    globalMutes = globalMutes.filter(player => player !== command_data["username"]);
                    break;
                case 'WA':
                    topAlert(command_data["username"] + " has warned you...", 5);
                    break;
                case 'KI':
                    topAlert(command_data["username"] + " has kicked you. You can rejoin by refreshing this page.", 30);
                    break;
                case 'ER':
                    topAlert(command_data["error"], 10);
                    break;
                default:
                    break;
            }
        }

        this.socket.onclose = function (event) {
            console.log("Socket closed!");
        }
    }
}

let chat;
let username = "";
let sprite_idx = "";
let my_id = "";
let weather = "";
let rank = "";
let ws_token = "";

function setUserData(user) {
  var skins = { "bunny": 0, "goat": 1, "rat": 2 };
  username = user.username;
  sprite_idx = skins[user.chosen_skin];
  my_id = user._id;
  rank = user.rank;
  ws_token = user.ws_token;
}

function setUserWeather(setWeather) {
  console.log("Weather is set: " + setWeather);
  chat.player.weather = setWeather;
  weather = setWeather;
}

function exit() {
    console.log("exit se zgodi");
    if (chat && chat.socket.readyState == 1) {
        chat.socket.close();
        console.log("Uga??am skripto!");
        return undefined;
    }
}

function newStart() {
    function formatPage() {
        let squares = $('.square-content');
        for (let i = 0; i < squares.length; i++) {
            const square = squares[i];
            $(square).height($(square).width());
            if (square.classList.contains('map')) {
                chat.resize($(square).width());
            }
        }
    }
    //chat.canvas = document.getElementById("tinyroom");
    //chat.socket = new WebSocket("ws://157.245.36.23:8070");
    chat = new Chat('tinyroom');
    formatPage();
    console.log("Zaganjam svet!");
}

$(function () {
    // Event Listeners, Function Declarations ==============
    $(".hamburger .fa").click(function () {
        $(".wrapper").addClass("active")
    })

    $(".wrapper .sidebar .close").click(function () {
        $(".wrapper").removeClass("active")
    })

    function fillCanvas(canvas) {
        let context = canvas[0].getContext('2d');
        context.fillStyle = '#FF0000';
        context.fillRect(0, 0, canvas.width(), canvas.height());
    }

    function formatPage() {
        let squares = $('.square-content');
        //console.log(squares);
        for (let i = 0; i < squares.length; i++) {
            const square = squares[i];
            $(square).height($(square).width());
            if (square.classList.contains('map')) {
                chat.resize($(square).width());
            }
            //console.log($(square).width(), $(square).height());
        }
    }

    $(window).resize(formatPage);


    // formatiranje s pomocjo javascripta

    //chat = new Chat('tinyroom');
    //formatPage();


    // End of Code =========================================




});

function getLocation() {
    console.log("Pridobivam lokacijo...");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function getLocation1() {
    console.log("Pridobivam lokacijo...");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success1, error);
    }
}

function success1(position) {
    console.log(position);
    $("getlon1").val(position.coords.longitude);
    $("getlat1").val(position.coords.latitude);

    $("#formRegister").submit(); // here the form is submit
}

function success(position) {
    console.log(position);
    $("getlon").val(position.coords.longitude);
    $("getlat").val(position.coords.latitude);

    $("#signinform").submit(); // here the form is submit
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

