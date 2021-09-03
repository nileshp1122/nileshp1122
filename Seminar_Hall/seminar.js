const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const { get } = require("http");
const cookieparser = require("cookie-parser");
const { getMaxListeners, send, title } = require("process");
const jwt = require("jsonwebtoken"); 
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const auth = require("./middleware/auth");
dotenv.config({path: './config.env'});
let nodemailer = require('nodemailer');
const { access } = require("fs");
const { Session } = require("inspector");

let app = express();
app.listen(8000, () => {
    console.log("Server started ar port 8000..");
});

//database connection
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Np@12345",
    database: "SeminarHall",
});

//test the connection
connection.connect(function (err) {
    if (err) throw err;
    return console.log("Connected to DB...");
});

app.use(cookieparser());

// Static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/JS", express.static(__dirname + "public/JS"));
app.use("/img", express.static(__dirname + "public/img"));

// writing a middleware to setup view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Homepage
app.get("/", (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (token === undefined) {
            let sql = "SELECT * FROM citiesDetail";
            let qry = connection.query(sql, (err, rows) => {
                if (err) throw err;
                res.render("index", {
                    title: "index",
                    user: rows,
                    login: false,
                });
            });
        } else {
            let sql = "SELECT * FROM citiesDetail";
            let qry = connection.query(sql, (err, rows) => {
                if (err) throw err;
                res.render("index", {
                    title: "index",
                    user: rows,
                    login: true,
                });
            });
        }      
    } catch (err) {
        res.render("index");
    }
});

//render the view_booking page
app.get("/view_booking", (req, res) => {
    let sql = "SELECT * FROM personDetails";
    let qry = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("./Admin/view_booking", {
            title: "Student Application",
            user: rows,
        });
    });
});

// render the searching page
app.post("/search", (req, res) => {
    const bookingDate1 = req.body.createdDate1;
    const bookingDate = req.body.createdDate;
    console.log(bookingDate);
    let sql = "SELECT * FROM personDetails WHERE createdDate BETWEEN ? AND ?";
    let qry = connection.query(sql,[bookingDate1,bookingDate], (err, rows) => {
        if (err) throw err;
        res.render("./Admin/searching", {
            title: "Student Application",
            user: rows,
        });
    });
});

// //render add page - user_add
app.get("/add", (req, res) => {
    res.render("./Admin/add_booking", {
        title: "Add Student",
    });
});

// after user clicks on save button - insert the record in table
app.post("/saved", (req, res) => {
    let data = { fullName: req.body.fullName,  email: req.body.email, phone: req.body.phone, venue: req.body.venue, eventDate: req.body.eventDate, eventTime: req.body.eventTime, guests: req.body.guests};
    let sql = "INSERT INTO personDetails SET ?";
    let qry = connection.query(sql, data, (err, rows) => {
        if (err) throw err;
        res.redirect("/view_booking");
    });
});

// select using id click on edit button
app.get("/edit/:id", (req, res) => {
    const userId = req.params.id;
    let sql = "SELECT * FROM personDetails WHERE id = ?";
    let qry = connection.query(sql, [userId], (err, rows) => {
        if (err) throw err;
        res.render("./Admin/update_booking", {
            title: "Edit Student",
            user: rows[0],
        });
    });
});

// after user clicks on save button of user edit page - update the record
app.post("/save_edit", (req, res) => {
    let sql = "UPDATE personDetails SET guests = ?, eventTime = ?, eventDate = ?, venue = ?, phone = ?, email = ?, fullName = ? WHERE id = ?";
    let qry = connection.query(sql, [req.body.guests, req.body.eventTime, req.body.eventDate, req.body.venue, req.body.phone, req.body.email, req.body.fullName, req.body.id], (err, rows) => {
        if (err) throw err;
        res.redirect("/view_booking");
    });
});

// after the user clicks on delete button
app.get("/delete/:id", (req, res) => {
    let sql = "DELETE FROM personDetails WHERE id = ?";
    let qry = connection.query(sql, [req.params.id], (err, rows) => {
        if (err) throw err;1
        res.redirect("/view_booking");
    });
});

// render the register page
app.get("/register", (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (token === undefined) {
            res.render("register", {login: false} );
        } else {
            res.render("register", {login: true} );
        } 
    } catch (err) {
        res.render("register");
    }
});

// render the login page
app.get("/login", (req, res) => {	
    try {
        const token = req.cookies.jwt;

        if (token === undefined) {
            res.render("login", {login: false} );
        } else {
            res.render("login", {login: true} );
        } 
    } catch (err) {
        res.render("login");
    }
});

// click on logout button user login exit
app.get("/logout",auth, (req, res) => {	
    res.clearCookie("jwt");
    console.log("Logout Successfully");
    res.render("login", {login: false});
});


 /* ------Post user Register ------ */
app.post("/register", (req, res) => {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const passw = req.body.passw;
    const phone = req.body.phone;
    console.log(req.body.email);
    console.log(req.body.passw);

    connection.query('SELECT * FROM userDetails WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error);
        }
        if(results.length > 0) {
            console.log("That email is already in use");
            return res.render('register', {
                message: 'That email is already in use'
            });
        }
        let hashedPassword = await bcrypt.hash(passw, 8);
        console.log(hashedPassword);
        connection.query('INSERT INTO userDetails SET ?', {fullName: fullName, email: email, passw: hashedPassword, phone: phone }, (error, results)=> {
            if(error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('login', {login: true});
            }
        });
    });
});

/* ------ Login with Hash ------ */
app.post("/login", (req, res, next) => {
    const email = req.body.email;
    const passw = req.body.passw;
    const adminEmail = req.body.email;
    const adminPassword = req.body.passw;
    console.log('simple pass 1',req.body.passw);

    let db = connection.query('SELECT * FROM userDetails WHERE email = ?', [email], async(error, results, fields) => {
        if (adminEmail == "abc@gmail.com" && adminPassword == 123456) {
            res.render("./Admin/dashboard");
            return false;
        }
        const emailCompare = results.length > 0;
        try{
            console.log('>>>>>> pass  ', {passw:passw});
            console.log('>>>>>> simple pass 2 ', passw)
            console.log('>>>>>> Hashed database ', results[0]["passw"])
            const match = await bcrypt.compare(passw, results[0]["passw"])        
            if(match) {
                let token = await jwt.sign({id:results[0].id, email:results[0].email}, process.env.SECRET_KEY );
                console.log("Token = ",token);
                console.log("SECRET = ",process.env.SECRET_KEY);   
                const userVer = await jwt.verify(token, process.env.SECRET_KEY );
                console.log("UserVar = ",userVer);
                res.cookie('jwt',token, { 
                    expires:new Date(Date.now() + 3000000),
                    httpOnly: true 
                });
                console.log('cookie created successfully');
                connection.query(`UPDATE userDetails SET tokens = '${token}' WHERE id = ${results[0].id};`);
                res.render('city', {login: true});
            }
            else {
                return res.status(400).send("invalid id or password !!!");
            }
        } catch(error) {
            res.status(400).send("invalid id or password !!!");
        }
    });
});

// render city page
app.get("/city", (req, res) => { 
    try {
        const token = req.cookies.jwt;
        if (token === undefined) {
            res.render("city", {login: false} );
        } else {
            res.render("city", {login: true} );
        } 
    } catch (err) {
        res.render("city");
    }
});

// render dashboard page
app.get("/dashboard", (req, res) => { 
    res.render("./Admin/dashboard");
});

// render venueData page
app.get("/venueData", (req, res) => { 
    let sql = "SELECT * FROM venueDetails";
    let qry = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("./Admin/venueData", {
            title: "Venue Data",
            user: rows,
        });
    });
});

// render mumbai-venue page
app.get("/mumbai-venue", auth , (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (token === undefined) {
            res.redirect("./Venues/mumbai-venue", {login: false} );
        } else {
            let sql = "SELECT * FROM venueDetails";
            let qry = connection.query(sql, (err, rows) => {
                if (err) throw err;
                res.render("./Venues/mumbai-venue", {
                    title: "mumbai-venue",
                    user: rows,
                    login: true,
                });
            });
        } 
    } catch (err) {
        res.render("./Venues/mumbai-venue");
    }
});

// render the user_details page
app.get("/user_details", (req, res) => {
    let sql = "SELECT * FROM userDetails";
    let qry = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("./Admin/user_details", {
            title: "User Details",
            user: rows,
        });
    });
});

// delete data from table using id
app.get("/delete1/:id", (req, res) => {
    let sql = "DELETE FROM userDetails WHERE id = ?";
    let qry = connection.query(sql, [req.params.id], (err, rows) => {
        if (err) throw err;
        res.redirect("/user_details");
    });
});

// render the contact_us page
app.get("/contact_Us", (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (token === undefined) {
            res.render("contact_us", {login: false} );
        } else {
            res.render("contact_us", {login: true} );
        } 
    } catch (err) {
        res.render("contact_us");
    }
});

// render the manage_venue page
app.get("/manage_venue", (req, res) => {
    res.render("./Admin/manage_venue");
});

// render the about-us page
app.get("/about_Us", (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (token === undefined) {
            res.render("about-us", {login: false} );
        } else {
            res.render("about-us", {login: true} );
        } 
    } catch (err) {
        res.render("about-us");
    }
});

 /* ------ Post data from Contact-Us page ------ */
app.post("/contact_Us", (req, res) => {
    let data = { contactName: req.body.contactName, contactEmail: req.body.contactEmail, contactNumber: req.body.contactNumber, contactSubject: req.body.contactSubject, contactMessage: req.body.contactMessage };
    let sql = "INSERT INTO contactDetails SET ?";
    let qry = connection.query(sql, data, (err, rows) => {
        if (err) throw err;
        res.redirect("/contact_Us");
    });
});

// render the contact_details page
app.get("/contactDetails", (req, res) => {
    let sql = "SELECT * FROM contactDetails";
    let qry = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("./Admin/contact_details", {
            title: "Contact Details",
            user: rows,
        });
    });
});

// click on delete button delete data
app.get("/delete2/:id", (req, res) => {
    let sql = "DELETE FROM contactDetails WHERE id = ?";
    let qry = connection.query(sql, [req.params.id], (err, rows) => {
        if (err) throw err;
        res.redirect("/contact_details");
    });
});

app.get("/goa-venue", auth , (req, res) => {
    res.render("./Venues/goa-venue");
});

app.get("/delhi-venue", auth , (req, res) => {
    res.render("./Venues/delhi-venue");
});

app.get("/kolkata-venue", auth , (req, res) => {
    res.render("./Venues/kolkata-venue");
});

app.get("/banglore-venue", auth , (req, res) => {
    res.render("./Venues/banglore-venue");
});

app.get("/hyderabad-venue", auth , (req, res) => {
    res.render("./Venues/hyderabad-venue");
});

app.get("/chennai-venue", auth , (req, res) => {
    res.render("./Venues/chennai-venue");
});

app.get("/ahmedabad-venue", auth , (req, res) => {
    res.render("./Venues/ahmedabad-venue");
});

/* ------ send email from Nodemailer ------ */
app.post("/Form", (req, res) => {
    let data = { fullName: req.body.fullName,  email: req.body.email, phone: req.body.phone, venue: req.body.venue, venueName: req.body.venueName, venueLocation: req.body.venueLocation, eventDate: req.body.eventDate, createdDate: new Date(), eventTime: req.body.eventTime, guests: req.body.guests};
    let sql = "INSERT INTO personDetails SET ?";
    let qry = connection.query(sql, data, (err, rows) => {
        if (err) throw err;
        var mail = req.body.email;
        console.log(mail); 
        let transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : 'nip7574@gmail.com',
                pass : 'Np@11221122'
            }
        });
        const content = `
            <div>
                <h1 style="background-color:#a9099e; color:white; text-align: center; padding:11px 0 11px 0px;  border-radius: 10px 0 10px 0;">Seminar Hall</h1>
                <br><br>
                <p style="background-color: rgb(75, 100,112); color:rgb(253, 253, 253); padding-top: 32px; font-size: 15px; text-align: center;  height: 71px; width: 205px; border-radius: 10px 0 10px 0; margin: 0 auto;"><b>Thank You !!! <br> Your Booking Successfull </b></p>
            </div>
        `;
        let mailOptions = {
            from : 'nip7574@gmail.com',
            to : mail,
            subject : 'Seminar Hall',
            html : content,
        };
        transporter.sendMail(mailOptions,(err,info)=>{
            if(err)
            {console.log("Error " + err.message);
            return;
        }
            console.log("Message sent... " + info.response);
        });      
        res.redirect("/mumbai-venue");
    });
});

