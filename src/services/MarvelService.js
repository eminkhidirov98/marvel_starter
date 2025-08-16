class MarvelService {
  _apiBase = 'https://marvel-server-zeta.vercel.app/';
  _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';

  getResource = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Could not fetch ${url}, status: ${res.status}, message: ${errorText}`
      );
    }
    return await res.json();
  };

  getAllCharacters = async () => {
    const res = await this.getResource(
      `${this._apiBase}characters?limit=10&${this._apiKey}`
    );
    if (!res.data || !res.data.results) {
      throw new Error('Нет данных characters в ответе API');
    }
    return res.data.results;
  };

  getCharacter = async (id) => {
    try {
      const res = await this.getResource(
        `${this._apiBase}characters/${id}?${this._apiKey}`
      );
      if (!res.data || !res.data.results || res.data.results.length === 0) {
        throw new Error('Нет данных персонажа в ответе API');
      }
      return this._transformCharacter(res.data.results[0]);
    } catch (error) {
      console.error(`Ошибка получения персонажа с ID ${id}:`, error);
      throw error;
    }
  };

  // Альтернативный метод - получить случайного персонажа из списка
  getRandomCharacter = async () => {
    try {
      const characters = await this.getAllCharacters();
      if (characters.length === 0) {
        throw new Error('Не удалось получить список персонажей');
      }
      const randomChar =
        characters[Math.floor(Math.random() * characters.length)];
      return this._transformCharacter(randomChar);
    } catch (error) {
      console.error('Ошибка получения случайного персонажа:', error);
      throw error;
    }
  };

  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : 'There is no description for this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1]?.url || char.urls[0].url,
    };
  };
}

export default MarvelService;
