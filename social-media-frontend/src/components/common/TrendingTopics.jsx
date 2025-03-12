import React from 'react';

const TrendingTopics = () => {
  const trends = [
    { id: 1, topic: '#JavaScript', posts: '10.5K posts' },
    { id: 2, topic: '#ReactJS', posts: '8.2K posts' },
    { id: 3, topic: '#WebDev', posts: '6.7K posts' },
    { id: 4, topic: '#Coding', posts: '5.9K posts' },
  ];

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Trending Topics</h3>
      <div className="space-y-4">
        {trends.map(trend => (
          <div key={trend.id} className="cursor-pointer hover:bg-gray-50 p-2 rounded">
            <p className="font-medium">{trend.topic}</p>
            <p className="text-sm text-gray-500">{trend.posts}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics; 