const axios = require('axios');

async function getBookDetails(bookTypes) {
  try {
    const books = [];
    
    for (const bookType of bookTypes) {
      const response = await axios.get(`${process.env.GOOGLE_BOOKS_API_URL}`, {
        params: {
          q: bookType,
          key: process.env.GOOGLE_BOOKS_API_KEY,
          maxResults: 5,
          langRestrict: 'en',
          orderBy: 'relevance',
          printType: 'books'
        }
      });

      if (response.data.items && response.data.items.length > 0) {
        const book = response.data.items[0];
        const volumeInfo = book.volumeInfo;

        books.push({
          id: book.id,
          title: volumeInfo.title,
          authors: volumeInfo.authors || [],
          description: volumeInfo.description,
          pageCount: volumeInfo.pageCount,
          categories: volumeInfo.categories || [],
          averageRating: volumeInfo.averageRating,
          ratingsCount: volumeInfo.ratingsCount,
          imageLinks: {
            thumbnail: volumeInfo.imageLinks?.thumbnail || null,
            small: volumeInfo.imageLinks?.smallThumbnail || null
          },
          previewLink: volumeInfo.previewLink,
          publishedDate: volumeInfo.publishedDate,
          publisher: volumeInfo.publisher
        });
      }
    }

    if (books.length === 0) {
      throw new Error('No books found for the recommended types');
    }

    return books;
  } catch (error) {
    console.error('Error fetching book details:', error.message);
    throw error;
  }
}

module.exports = {
  getBookDetails
}; 