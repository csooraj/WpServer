
const express        =        require("express");
const cmd            =        require('node-cmd');
const app            =        express();
const Promise        =        require('bluebird');
const bodyParser     =        require('body-parser');
const fs             =        require('fs');
const replace        =        require('replace-in-file');
const shell          =        require('shelljs');
const cors           =        require('cors');


const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })


app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', express.static(__dirname));

app.use(cors());

// app.listen(3000,function(){
//   console.log("Started on PORT 3000");
// })

app.listen(process.env.PORT || 3000);

app.post('/newproject',function(req,res) {
  var appName = req.body.appName;
  var error = {"message": 'Some Error Occured Try Again'};
  const script =
  `
  cd folder
  exp publish --release-channel production --non-interactive
  exp build:android --release-channel production --non-interactive --no-publish
  curl -o app.apk "$(exp url:apk --non-interactive)"

  `;
  getAsync('exp init -t blank ' + appName).then(data => {
    var success = { "appName": appName, "message": 'The Project Created Sucessfully', "output": data};
    cmd.get(
        `
            cd ${appName}
            touch deploy
            chmod u+x deploy
        `,
        function(err, data, stderr) {
            if (!err) {
            } else {
                  res.status(200).send((error));
            }
        }
    );
    var filepath = appName+"/deploy";

    fs.writeFile(filepath, script, (err) => {
        if (err) {
          console.log(err);
        };
        console.log("The file was succesfully saved!");
        res.status(200).send(('the project created successfully ', success));
    });
  }).catch(err => {
      res.status(200).send((error));
  });
});

app.post('/addurl',function(req,res){
  var appUrl = String(req.body.appUrl);
  var appName = req.body.appName;
  var error = {"message": 'Some Error Occured Try Again'};
  fs.createReadStream('WebViewCode.js').pipe(fs.createWriteStream(appName+'/App.js'));
  const options = {
    files: appName+'/App.js',
    from: "https://www.amazon.in/",
    to: appUrl,
  };
  replace(options)
  .then(changes => {
    var success = { "appName": appName, "message": 'The Url Added Successfully', "output": changes};
    res.status(200).send(('the url added successfully', success));
  })
  .catch(error => {
    var error = { "appName": appName, "message": 'Some Error Occured Try Again', "output": error};
    res.status(200).send(('the url added successfully', error));
  });
});


app.post('/publishproject',function(req,res){
  req.setTimeout(500000000);
  var appName = req.body.appName;
  var error = { "appName": appName, "message": 'Some Error Occured Try Again'};
  var test = `cd  daasd` ;
  shell.exec('exp publish ' + appName, function(code, stdout, stderr) {
    if(stdout){
      var success = { "appName": appName, "message": stdout};
      res.status(200).send((success));
    } else {
      res.status(200).send((error));
    }
  });

  //  var process = getAsync().then(data => {
  //     var success = { "appName": appName, "message": 'The Project Started Successfully', "output": data};
  //     res.status(200).send(('the project published successfully ', success));
  // }).catch(err => {
  //     res.status(200).send((error));
  // });

  // cmd.get(
  //       `
  //           cd ${appName}
  //           ls
  //       `,
  //       function(err, data, stderr){
  //           if (!err) {
  //             // cmd.get(
  //             //     'exp publish',
  //             //     function(err, data, stderr){
  //             //         console.log('the current working dir is : ',data, stderr, err)
  //             //     }
  //             // );

});



app.post('/buildapk',function(req,res){
  req.setTimeout(500000000);
  var appName = req.body.appName;
  var error = { "appName": appName, "message": 'Some Error Occured Try Again'};
  const data = {
    "android": {
      "package": "org.yourcompany.yourappname"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourappname"
    },
  };
  var obj = JSON.parse(fs.readFileSync(appName+'/app.json', 'utf8'));
  console.log(obj ["expo"]);
  obj ["expo"]["android"] = {};
  const expo = obj["expo"];
  expo ["android"] ["package"] = "com.jeetlab."+appName;
  const output = { "expo" : expo };
  // obj.ios.bundleIdentifier = "com.yourcompany.yourappname2";
  fs.writeFile (appName+'/app.json', JSON.stringify(output), function(err) {
    if (err) {
      res.status(200).send((error));
      throw err;
    }
    const options = {
      files: appName+'/deploy',
      from: ["cd folder" ],
      to: ["cd " + appName],
    };
    replace(options)
    .then(changes => {
      shell.exec(appName+'/deploy',  function(code, stdout, stderr) {
        if(stdout){
          var success = { "appName": appName, "message": "App Build Successfully"};
          res.status(200).send((success));
        } else {
          res.status(200).send((error));
        }
      });
    })
    .catch(error => {
      var error = { "appName": appName, "message": 'Some Error Occured Try Again', "output": error};
      res.status(200).send(('the url added successfully', error));
    });
    }
  );
});


app.post('/downloadapk',function(req,res){
  var appName = req.body.appName;
  var fileLink = "http://localhost:3000/"+appName+"/app.apk";
  var link = { "appName": appName, "message": 'Build Sucessfull', "output": fileLink};
  res.status(200).send((link));
});
