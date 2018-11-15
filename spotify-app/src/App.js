import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      token: '',
      deviceId: '',
      loggedIn: false,
      error: '',
      trackName: 'Track Name',
      albumName: 'Album Name',
      artistName: 'Artist Name',
      playing: false,
      positions: 0,
      duration: 0
    };
    this.playerCheckInterval = null;
  }

  handleLogin(){
    if (this.state.token !== "") {
      this.setState({ loggedIn: true });
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
  }

  checkForPlayer() {
    const {token} = this.state;
    if (window.spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: 'oneil spotify player',
        getOauthToken: callback => { callback(token); },
      });
      this.createEventHandlers();
      this.player.connect();
    }
  }

  createEventHandlers() {
    //error events
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });

    //player_state_changed event that updates shows your devices current states
    //https://developer.spotify.com/documentation/web-playback-sdk/reference/#object-web-playback-state
    this.player.on('player_state_changed', (state) =>  {
      this.onStateChanged(state);
      console.log(state, 'the changed state');
    });

    //ready spits out webPlayBackPlayer object which holds current device_id
    this.player.on('ready', async data => {
      let { device_id } = data;
      console.log('let the music play on!');
      await this.setState({ deviceId: device_id})
      this.transferPlaybackHere();
    });
  }

  onStateChanged(state) {
    if (state !== null) {
      console.log(state.track_window, 'track window');
      console.log(this.state, 'current State')
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists.map(artist => artist.name).join(', ');
      const playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing
      });
    }
  }

  onPrevClick() {
    this.player.previousTrack();
  }

  onPlayClick() {
    this.player.togglePlay();
  }

  onNextClick() {
    this.player.nextTrack();
  }

  transferPlaybackHere() {
    const { deviceId, token } = this.state;
    console.log(deviceId)
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        "device_ids": [ deviceId ],
        "play": true,
      }),
    });
  }


  render() {
    const {
      token,
      loggedIn,
      trackName,
      albumName,
      artistName,
      error,
      position,
      duration,
      playing,
    } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h2>Now Playing</h2>
          <p>Spotify PlayBack demo</p>
        </div>

        {error && <p>Error: {error}</p>}

        {loggedIn ?
        (<div>
          <p>Artist: {artistName}</p>
          <p>Album: {albumName}</p>
          <p>Track: {trackName}</p>
          <p>
            <button onClick={() => this.onPrevClick()} >Previous</button>
            <button onClick={() => this.onPlayClick()}>{playing ? "Pause" : "Play"}</button>
            <button onClick={() => this.onNextClick()}>Next</button>
          </p>
        </div>)
        :
        (<div>
          <p className="App-intro">
            Enter your spotify access token. Get it from {' '}
            <a href='https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify'>
              here
            </a>.
          </p>
          <p>
            <input type='text' value={token} onChange={e => this.setState({ token: e.target.value})} />
          </p>
          <p>
            <button onClick={() => this.handleLogin()}>Go</button>
          </p>
         </div>)
        }
      </div>
    );
  }
}

export default App;
