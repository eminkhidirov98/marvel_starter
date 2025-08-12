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
    const res = await this.getResource(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    );

    if (!res.data || !res.data.results || res.data.results.length === 0) {
      throw new Error('Нет данных персонажа в ответе API');
    }

    return this._transformCharacter(res.data.results[0]);
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
