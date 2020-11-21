import React, { Component } from "react";
import cookie from "react-cookies";
import styled from "styled-components";
import { googleTranslate } from "./utils/googleTranslate";

const StyledInputContainer = styled.div`
  margin: 10px;
`;

const StyledUserInputContainer = styled.div`
  margin: 10px;
`;

const StyledSelectContainer = styled.div`
  margin: 10px;
`;

const defaultState = {
  languageCodes: [],
  language: "en",
  userInput: "",
  userAnswer: ""
};

class App extends Component {
  state = defaultState;

  componentDidMount() {
    // load all of the language options from Google Translate to your app state

    googleTranslate.getSupportedLanguages("en", function(err, languageCodes) {
      getLanguageCodes(languageCodes); // use a callback function to setState
    });

    const getLanguageCodes = languageCodes => {
      // languageCodes.push({ language: "default", name: "Choose a language" });
      this.setState({ languageCodes });
    };
  }

  render() {
    const { languageCodes, language, userAnswer } = this.state;
    console.log(languageCodes);

    return (
      <div style={this.divStyle}>
        <StyledInputContainer>
          <input
            value={this.state.userInput}
            onChange={e => this.setState({ userInput: e.target.value })}
          />
        </StyledInputContainer>
        <StyledUserInputContainer>
          <p>{userAnswer}</p>
        </StyledUserInputContainer>

        {/* iterate through language options to create a select box */}
        <StyledSelectContainer>
          <select
            className="select-language"
            value={language}
            onChange={e => this.changeHandler(e.target.value)}
          >
            {languageCodes.map(lang => (
              <option key={lang.language} value={lang.language}>
                {lang.name}
              </option>
            ))}
          </select>
        </StyledSelectContainer>
      </div>
    );
  }

  changeHandler = language => {
    let { userInput } = this.state;
    let cookieLanguage = cookie.load("language");
    let transUserInput = "";

    const translating = transUserInput => {
      if (userInput !== transUserInput) {
        this.setState({ userAnswer: transUserInput });
        cookie.save("question", transUserInput, { path: "/" });
      }
    };

    // translate the userInput when selecting a different language
    if (language !== cookieLanguage) {
      googleTranslate.translate(userInput, language, function(
        err,
        translation
      ) {
        transUserInput = translation.translatedText;
        translating(transUserInput);
      });
    }

    this.setState({ language });
    cookie.save("language", language, { path: "/" });
  };

  // just some inline css to center our demo
  divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100wh"
  };
}

export default App;
