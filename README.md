# CS554_Based_Project
What is LiftTrek about? 
Ever wanted to start working out, but did not know where to start? With countless muscles on the human body, and even more possible exercises, the options can be overwhelming and result in demotivation. With LiftTrek, you would be able to choose from a variety of muscles or muscle groups with a specific goal, and create a workout plan! At the same time, users can track their progress by uploading pictures after their workouts (with basic editing capabilities). Functioning as a form of social media, users can view exercise plans of other users and relevant images, leaving comments, likes, or adding the workout to their favorites.

In order to run our project, required technologies are:
    Redis
    GraphicsMagick
    Firebase Auth
    AWS S3.

Redis is downloadable from the same way we have used in our course content
Installation instructions for Graphicsmagick can best be viewed here: https://gist.github.com/sonnyit/f2dde32360b419ac65269bd5b463b5b4
    Restart your computer after installing to get the path included in your environment.
    Please ensure that GM is working on your computer by testing with the command 'gm convert logo: logo.miff'
        This command should create an image file in your current directory. If this works, then so should our website!
Firebase Auth and AWS S3 do not need any additional technologies, but the information for testing will provided to the TA.

Our project requires two terminals to run. One to cd into lifttrek, and the other to cd into express-server.
In the express-server terminal, or the server terminal, first run 'node seed.js', and press CTRL+C after the console logs the sentence "you can close me now." This will provide two posts, to go with the provided test user of "testuser@gmail.com" with the password "testing123".
Afterwards, in the same terminal, type npm start to create the express server. 
In the other terminal, the lifttrek one, simply run 'npm start', and use the website as needed!

The firebase authentication information is shared with the TA already.
The AWS S3 information is cslifttrek@gmail.com, with password CS554_23
