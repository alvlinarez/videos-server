const Playlist = require('../../models/Playlist');

exports.getPlaylist = async (userId) => {
  try {
    const playlist = await Playlist.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'movies',
          localField: 'movies',
          foreignField: '_id',
          as: 'movies_total'
        }
      },
      {
        $unwind: '$movies_total'
      },
      {
        $group: {
          _id: '$_id',
          movies: {
            $push: '$movies_total'
          }
        }
      },
      {
        $project: {
          _id: false,
          id: '$_id',
          movies: {
            $map: {
              input: '$movies',
              as: 'mov',
              in: {
                id: '$$mov._id',
                tags: '$$mov.tags',
                title: '$$mov.title',
                year: '$$mov.year',
                cover: '$$mov.cover',
                description: '$$mov.description',
                duration: '$$mov.duration',
                source: '$$mov.source',
                contentRating: '$$mov.contentRating'
              }
            }
          }
        }
      }
    ]);
    return {
      playlist: playlist[0]
    };
  } catch (e) {
    return {
      error: e.message
    };
  }
};
