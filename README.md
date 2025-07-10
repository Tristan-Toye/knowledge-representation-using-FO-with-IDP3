# MCS25 Project

Phe MCS project for the year 2025 is modeling the Set Game.
For this project, an editing/visualization environment is made.
Please read the following to get started with the project.

## Starting the project

Clone this repository to your local machine. It is recommended that you clone rather than download, as this will make it easier to fetch the source code in case of any updates.

1) Start the project web application server by running `python set.py` in the root directory
    - Note that python3 is needed for this project. In case your `python` command alias points to another version, you might need to use the `python3` command (or change the alias). 
2) Open your browser and navigate to `localhost:8000` (or the port you configured).
3) The application contains all the further information.

*If the app fails to launch or you see the error page when you open it, refer to the configuration section.*

*The app was mainly tested on **Linux** systems and Firefox and Chrome browsers, in case of any issues on other platforms, please switch to the tested environment.* 

## Configuration

By default, the app should work out of the box (if you have IDP installed on your system).
The `config.json` file allows you to specify:
- A custom path to the IDP binaries (the default value is empty, in which case the app will try to find `idp` binaries). If you would like to use binaries from your IDP-IDE package they are stored in (note that you should provide an absolute path to the IDP binaries):
    - Linux: `<path-to-to-IDP-IDE>/resources/app/idp3/bin/idp`.
    - Unofficial systes:
        - MacOS: `<path-to-to-IDP-IDE>/idp3-ide.app/Contents/Resources/app/idp3/bin/idp`.
        - Windows: This is not possible for Windows (it works only with WSL, if your IDE works the app shuold work too).
- The timeout limit for executing IDP (the default value 20 seconds).
- The port of the web application (the default value is 8000).

## Updating the project

In case there are some changes of the source code of the project made by teaching assistants, you will need to get them (this can happen in case of bug fixes or other improvements).
We will announce these changes in Toledo.

To fetch the changes you can do the following:
1) Download your current solution as a backup (in case something goes wrong).
2) Stash your changes with the command `git stash`.
3) Fetch the update by running `git pull`.
4) Restore your changes with the command  `git stash pop`.

Note, all of these commands should be done in the root directory of the project.

### Conflicts

In case we updated some of the idp files that are part of your solution, it is possible that you would get a conflict when doing `git stash pop`.
To resolve the conflict, open the conflicted file and remove the meta lines, for example, the following conflict:
```
 <<<<<<< Updated upstream
 The update ...
 =======
 Code from your stash ...
 >>>>>>> Stashed changes
```
Should be resolved as:
```
 The update ...
 Code from your stash ...
```

Finally run `git add .` to add these changes and `git stash clear` to clear the stash.

If you are not familiar with the git, please refer to [documentation pages](https://git-scm.com/doc) for some help.

## Using IDP-IDE (optional)

In case you would like to use IDP-IDE to edit your files, you can set the workspace to `./idp/set1/` (here `.` stands for the root of the project). Make sure not to edit files in the `template` directory.

## Comunication

If you find a bug, please open an issue on the [GitLab issue page](https://gitlab.com/krr/mcs25-project/-/issues).
If you are not sure about creating an issue, you can send an email to [Djordje Markovic](mailto:dorde.markovic@kuleuven.be).

In case you have any doubts or questions regarding the project assignment, please send an email to all teaching assistants.

## Submitting solution

When you finish your project, download the files with the web app (there is a button download in the top menu), put your u/r/s number (with the letter) and upload it to the Toledo assignment page. 
If you are working in a pair, add the u/r/s/ number of your teammate in parentheses after your id (e.g., "r123456(r654321)"). 
Note that both members of the team should upload the solution, however, it should be the same.
You can upload your solution multiple times, only the last version will be considered.
