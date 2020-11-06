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
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    clone() {
        return new Vector(this.x, this.y);
    }
}

// UTILITY FUNCTIONS =======================================
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
// END OF UTILITY FUNCTIONS ================================

class User {

    constructor(position, name, weather, sprite_idx) {
        this.sprite_wh = 30;
        this.position = position;
        this.name = name;
        this.weather = weather;
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.sprite_wh;
        this.canvas.height = this.sprite_wh;
        this.sprite_idx = sprite_idx;
        this.draw_avatar();

    }

    draw_avatar() {
        var user = this;
        var img = returnImageObject('static/sprites.png', function () {
            user.context.drawImage(img, user.sprite_idx * 30, 0, 30, 30, 0, 0, user.sprite_wh, user.sprite_wh);
        });
    }

}

class Chat {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);
        this.context = this.canvas.getContext('2d');
        // all users without logged in user
        this.users = [];
        // logged in user
        this.player;

        // set up background drawing offset
        this.background_width = 2000;
        this.background_height = undefined;
        this.background_size = new Vector();
        this.background_center = new Vector(0.42, 0.36); // from 0 to 1, percentage
        this.offset = undefined;
        
        var chat = this;
        // set up background
        this.background = returnImageObject('static/map.png', function() {
            // this executes when the background loads
            // set background center to center of screen
            // calculate ratio
            var ratio = chat.background.width/chat.background.height;
            // set height
            chat.background_height = chat.background_width / ratio;

            chat.offset = new Vector(
                chat.background_width * chat.background_center.x - chat.canvas.width/2,
                chat.background_height * chat.background_center.y - chat.canvas.height/2
            );

            // Start drawing
            chat.drawLoop();
            
            // add event listeners for interacting
            chat.hookControls();
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

    resize(width) {
        this.canvas.style.width = '95%';
        this.canvas.style.height = '95%';
        this.canvas.width = 0.95 * width;
        this.canvas.height = this.canvas.width;
    }

    hookControls() {
        var chat = this;
        // move handler
        document.addEventListener('click', function(click) {
            var position = getCanvasMousePos(click, chat.canvas);
            var wanted_position = position.clone().add(chat.offset);
            chat.player.position = wanted_position;
        });
    }

    centerOnPlayer() {
        var left_upper_corner = this.offset;
        var right_bottom_corner = this.offset.clone().add(new Vector(this.canvas.width, this.canvas.height));
        var canvas_center = this.offset.clone().add(new Vector(this.canvas.width/2, this.canvas.height/2));
        var player_position = this.player.position;
        // check if player is close to border, move if he is
        const treshold = 100;
        const move_speed = 5;
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
            var direction = canvas_center.subtract(player_position).normalize();
            // finally move the offset
            this.offset.subtract(direction.multiply(move_speed));
        }
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
            context.clearRect(0, 0, chat.canvas.width, chat.canvas.height);
            // move offset towards player
            chat.centerOnPlayer();
            context.drawImage(chat.background, -chat.offset.x, -chat.offset.y, chat.background_width, chat.background_height);

            for (let i = 0; i < chat.users.length; i++) {
                var user = chat.users[i];
                
                context.drawImage(user.canvas, user.position.x - chat.offset.x - avatar_size/2, user.position.y - chat.offset.y - avatar_size/2, avatar_size, avatar_size);

            }

        }

        setInterval(function () {
            loop();
        }, 16.666);
    }
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

    // write your functions here

    // End of Event Listeners, Function Declarations =======

    // Start of Code =======================================
    // Tukaj lahko klicete funkcije da jih testirate



    // formatiranje s pomocjo javascripta
    var chat = new Chat('tinyroom');
    formatPage();
    // End of Code =========================================

    var position = new Vector(600, 600);
    var name = "Domen";
    var weather = "Sunny";
    var user1 = new User(position, name, weather, 1);
    chat.addUser(user1, true);
});
