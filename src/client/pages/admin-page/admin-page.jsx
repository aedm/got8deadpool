import {Meteor} from "meteor/meteor";
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {
  Form,
  Col,
  Row,
  Button,
  FormGroup,
  FormControl,
  ControlLabel,
  Alert,
  Checkbox
} from 'react-bootstrap';

import {Logger} from "/src/lib/logger.js";
import {SubmitWithState} from "/src/lib/submit.js";
import {AppState} from '/src/collections/app-state.js';
import {
  OnePointCharacters,
  TwoPointCharacters,
  ThreePointCharacters,
  TwoPointEvents,
  Bets
} from '/src/game/bets.js';

class _AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationErrors: {},
    };
  }

  submit() {
    let hasErrors = false;
    let episode = this.episode.value;
    if (!/^\d+$/.test(episode)) {
      Logger.error("bad episode number");
      return;
    }
    episode = parseInt(episode);

    let deadpool = {};
    Object.keys(Bets).forEach(token => {
      let episode = this[`tokenEpisode_${token}`].value;
      let comment = this[`tokenComment_${token}`].value;
      if (episode !== "" || comment !== "") {
        if (!/^\d*$/.test(episode)) {
          Logger.error(`"${Bets[token].name}" has invalid value`);
          hasErrors = true;
          return;
        }
        let item = {};
        if (episode !== "") item["episode"] = parseInt(episode);
        if (comment !== "") item["comment"] = comment;
        deadpool[token] = item;
      }
    });
    if (hasErrors) {
      this.setState({isSubmitted: true, submitErrorMessage: "Error, see debug logs"});
      return;
    }

    let isVotingClosed = this.isVotingClosed.checked;
    let isSeasonOver = this.isSeasonOver.checked;
    SubmitWithState(this, "admin/updateGameState", {
      episode,
      deadpool,
      isVotingClosed,
      isSeasonOver,
    });
  }

  renderBetArray(array) {
    return array.map(bet => {
        let deadPoolItem = this.props.gameProgress.deadPool[bet.token];
        let episode = deadPoolItem ? deadPoolItem.episode : null;
        let comment = deadPoolItem ? deadPoolItem.comment : null;
        return <FormGroup key={bet.token}>
          <Col componentClass={ControlLabel} sm={4}>{bet.name}</Col>
          <Col sm={8}>
            <Row>
              <Col sm={4}>
                <FormControl type="text"
                             defaultValue={episode}
                             placeholder="episode"
                             inputRef={x => this[`tokenEpisode_${bet.token}`] = x}/>
              </Col>
            </Row>
            <FormControl type="text" className="bet-comment"
                         defaultValue={comment}
                         placeholder="comment"
                         inputRef={x => this[`tokenComment_${bet.token}`] = x}/>
          </Col>
        </FormGroup>;
      }
    );
  }

  renderServerMessage() {
    if (!this.state.isSubmitted) return null;
    let isError = !!this.state.submitErrorMessage;
    let msg = isError ? `Server error: "${this.state.submitErrorMessage}"` : "Submitted";
    return <Alert bsStyle={isError ? "danger" : "info"} closeLabel="Whatever"
                  onDismiss={() => this.setState({isSubmitted: false}) }>
      {msg}
    </Alert>;
  }

  render() {
    return <div className="container">
      <div className="game-page admin-page">
        <h2>You must be this tall to die</h2>
        <Form horizontal>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={4}>Voting closed</Col>
            <Col sm={2}>
              <Checkbox defaultChecked={!!this.props.gameProgress.isVotingClosed}
                        inputRef={x => this.isVotingClosed = x}/>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={4}>Season over</Col>
            <Col sm={2}>
              <Checkbox defaultChecked={!!this.props.gameProgress.isSeasonOver}
                        inputRef={x => this.isSeasonOver = x}/>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={4}>Current episode</Col>
            <Col sm={2}>
              <FormControl type="text"
                           defaultValue={this.props.gameProgress.episode}
                           inputRef={x => this.episode = x}/>
            </Col>
          </FormGroup>
          <h5>Triple score</h5>
          { this.renderBetArray(ThreePointCharacters) }
          <h5>Double score</h5>
          { this.renderBetArray(TwoPointCharacters) }
          <h5>Others</h5>
          { this.renderBetArray(OnePointCharacters) }
          <h5>Events</h5>
          { this.renderBetArray(TwoPointEvents) }

          { this.renderServerMessage() }

          { !this.state.isSubmitting ?
            <Button bsStyle="danger" onClick={() => this.submit()}>
              Save and calculate scores
            </Button>
            :
            <Button bsStyle="danger" disabled>Patience is a virtue</Button>
          }

        </Form>
      </div>
    </div>;
  }
}

export const AdminPage = createContainer(() => {
  return {
    gameProgress: AppState.findOne("gameProgress"),
  };
}, _AdminPage);
