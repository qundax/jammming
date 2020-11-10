import React from 'react';
import './Playlist.css';

import Tracklist from '../Tracklist/Tracklist';

export default class Playlist extends React.Component {
  render() {
    return (
      <div className="Playlist">
        <input defaultValue={"New Playlist"}/>
        <Tracklist tracks={this.props.playlistTracks} />
        <button className="Playlist-save">SAVE TO SPOTIFY</button>
      </div>
    )
  }
}