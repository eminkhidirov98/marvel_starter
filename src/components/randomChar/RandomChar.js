import { Component } from 'react';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
  state = {
    char: {},
    loading: true,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  onCharLoaded = (char) => {
    this.setState({ char, loading: false, error: false });
  };

  onError = (err) => {
    console.error(err);
    this.setState({ error: true, loading: false });
  };

  updateChar = async () => {
    this.setState({ loading: true, error: false });

    try {
      const characters = await this.marvelService.getAllCharacters();
      const randomChar =
        characters[Math.floor(Math.random() * characters.length)];
      const char = await this.marvelService.getCharacter(randomChar.id);
      this.onCharLoaded(char);
    } catch (err) {
      this.onError(err);
    }
  };

  render() {
    const { char, loading, error } = this.state;
    const { name, description, thumbnail, homepage, wiki } = char;

    if (loading) {
      return <div className="randomchar">Загрузка персонажа...</div>;
    }

    if (error) {
      return (
        <div className="randomchar">
          Ошибка загрузки персонажа.
          <button className="button button__main" onClick={this.updateChar}>
            <div className="inner">Попробовать ещё</div>
          </button>
        </div>
      );
    }

    return (
      <div className="randomchar">
        <div className="randomchar__block">
          <img src={thumbnail} alt={name} className="randomchar__img" />
          <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">{description}</p>
            <div className="randomchar__btns">
              <a
                href={homepage}
                className="button button__main"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="inner">homepage</div>
              </a>
              <a
                href={wiki}
                className="button button__secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="inner">Wiki</div>
              </a>
            </div>
          </div>
        </div>
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          <button className="button button__main" onClick={this.updateChar}>
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

export default RandomChar;
