import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
  state = {
    char: {},
    loading: true,
    error: false,
    attempts: 0, // Счетчик попыток загрузки
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
    // this.timerId = setInterval(this.updateChar, 15000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  onCharLoaded = (char) => {
    this.setState({
      char,
      loading: false,
    });
  };

  onCharLoading = () => {
    this.setState({
      loading: true,
    });
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  updateChar = () => {
    this.setState(prevState => ({ attempts: prevState.attempts + 1 }));
    this.onCharLoading();
    
    // Сначала пробуем получить персонажа по случайному ID
    const id = Math.floor(Math.random() * (1011400 - 1009000) + 1009000);
    
    this.marvelService
      .getCharacter(id)
      .then(this.onCharLoaded)
      .catch((err) => {
        console.error('Ошибка загрузки персонажа по ID:', err);
        // Если не удалось по ID, используем альтернативный метод
        this.marvelService
          .getRandomCharacter()
          .then(this.onCharLoaded)
          .catch((fallbackErr) => {
            console.error('Ошибка fallback метода:', fallbackErr);
            this.onError();
          });
      });
  };

  render() {
    const { char, loading, error, attempts } = this.state;
    const errorMessage = error ? <ErrorMessage attempts={attempts} /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? <View char={char} /> : null;

    return (
      <div className="randomchar">
        {errorMessage}
        {spinner}
        {content}
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          <button onClick={this.updateChar} className="button button__main">
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;
  let imgStyle = { objectFit: 'cover' };
  if (
    thumbnail ===
    'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
  ) {
    imgStyle = { objectFit: 'contain' };
  }

  return (
    <div className="randomchar__block">
      <img
        src={thumbnail}
        alt="Random character"
        className="randomchar__img"
        style={imgStyle}
      />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description}</p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
