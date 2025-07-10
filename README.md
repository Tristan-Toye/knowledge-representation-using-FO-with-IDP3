# Knowledge Representation using First-Order Logic with IDP3

## Overview

This project is an educational web application for learning knowledge representation using First-Order Logic (FO) with the IDP3 system. It focuses on modeling and reasoning about temporal systems using Linear Temporal Logic (LTC) and IDP3, specifically through the implementation of the "Set" card game.

## Project Description

The MCS25 (Modeling and Constraint Solving) project consists of two main parts:

### Part 1: Simple Static System
- **Objective**: Develop basic concepts for the "Set game" using IDP3
- **Tasks**:
  - Extend the vocabulary with appropriate types, predicates, and function symbols
  - Model the notion of a "set" of cards
  - Model all possible "sets" among cards on the table
- **Grading**: Manual inspection and automatic testing (1.0 points)

### Part 2: Complex LTC System
- **Objective**: Develop a full multiplayer "Set game" using IDP3 LTC system
- **Features**:
  - Turn-based multiplayer gameplay
  - Score tracking and game state management
  - Temporal reasoning with LTC
- **Grading**: Automatic correction through model checking (2.5 points)

## The Set Game

The project implements a variation of the classic "Set" card game where:

- **Cards** have four properties: Number (1,2,3), Color (Red,Green,Orange), Shade (Empty,Stripes,Full), Shape (Diamond,Squiggle,Oval)
- **Sets** are formed when three cards have either all the same or all different values for each property
- **Gameplay** involves players taking turns to either guess sets or claim no sets exist
- **Scoring** rewards correct guesses and penalizes incorrect ones

## Features

- **Interactive Web Interface**: Modern web-based IDE for IDP3 development
- **Real-time Code Execution**: Execute IDP3 theories and see results instantly
- **Visual Card Representation**: SVG-based card graphics for game visualization
- **Progress Tracking**: Monitor completion of different project components
- **Download Functionality**: Export completed solutions for submission

## Technology Stack

- **Backend**: Python HTTP server with IDP3 integration
- **Frontend**: HTML5, CSS3, JavaScript with CodeMirror editor
- **Logic Engine**: IDP3 (Interactive Development of Programs)
- **Styling**: Bootstrap framework with custom CSS

## Prerequisites

- Python 3.x
- IDP3 system installed and accessible via command line
- Modern web browser

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd knowledge-representation-using-FO-with-IDP3
   ```

2. **Install IDP3**:
   - Download and install IDP3 from the official website
   - Ensure the `idp` command is available in your system PATH
   - Alternatively, specify the IDP3 path in `config.json`

3. **Configure the application**:
   - Edit `config.json` to set your IDP3 path and preferences
   - Adjust timeout and port settings if needed

4. **Run the application**:
   ```bash
   python set.py
   ```

5. **Access the application**:
   - Open your browser and navigate to `http://localhost:8000`
   - The application will automatically detect if IDP3 is properly configured

## Project Structure

```
knowledge-representation-using-FO-with-IDP3/
├── set.py                 # Main Python server application
├── config.json           # Configuration file
├── pages/                # HTML pages for the web interface
│   ├── menu.html         # Main menu page
│   ├── assignment.html   # Project description and rules
│   ├── set1.html         # Part 1 interface
│   ├── set2.html         # Part 2 interface
│   ├── help.html         # Help and support information
│   └── video.html        # Demo video page
├── idp/                  # IDP3 theory files
│   ├── set1/            # Part 1 theories and templates
│   ├── set2/            # Part 2 theories and templates
│   └── explanation/     # Additional explanation files
└── static/              # Static assets (CSS, JS, images)
    ├── css/             # Stylesheets
    ├── js/              # JavaScript modules
    ├── deck/            # Card SVG graphics
    └── bower_components/ # Third-party libraries
```

## Usage

1. **Start with the Assignment**: Read the project description and rules
2. **Part 1 Development**: 
   - Extend the vocabulary for card representation
   - Implement set detection logic
   - Test with provided examples
3. **Part 2 Development**:
   - Implement full game logic with temporal reasoning
   - Use LTC for modeling game state transitions
   - Test with the provided game simulation

## Grading

The project is worth 5/20 points total:
- **Part 1**: 1.0 points (manual + automatic testing)
- **Part 2**: 2.5 points (automatic model checking)
- **Exam Questions**: 1.5 points (CTL, LTL, and refinement)

## Support

For questions or technical support:
- **Teaching Assistants**: 
  - dorde.markovic@kuleuven.be
  - senne.berden@kuleuven.be
  - carlos.cantero@kuleuven.be
- **Bug Reports**: Send to dorde.markovic@kuleuven.be with subject "MCS25-Project-Part-x-Bug"
- **GitLab Issues**: [Project Issues Page](https://gitlab.com/krr/mcs25-project/-/issues)

## License

This project is open source and available under the terms specified in the LICENSE file.

## Credits

Developed by the MCS didactic team at KU Leuven. The system uses IDP3, Python, HTML, JavaScript, and CSS technologies.

---

**Note**: This project is part of the MCS25 course curriculum. Students are encouraged to discuss the project with others but should not make their code publicly available on the web. 