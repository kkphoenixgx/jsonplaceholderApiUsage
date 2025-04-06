const responsesDivEl = document.querySelector("#responses")



const fetchPosts = async  ()=>{

  const postsResponse = fetch('https://jsonplaceholder.typicode.com/posts');
  const photosResponse = fetch('https://jsonplaceholder.typicode.com/photos');
  
  const [posts, photos] = await Promise.all([postsResponse, photosResponse]);
  
  const postsJson = await posts.json()
  const photosJson = await photos.json();
  
  const postsAndPhotos = postsJson.map((post, index) => {
      const newUrl = photosJson[index].url.replace('https://via.placeholder.com', 'https://picsum.photos/seed').split("/")
      const p1 = newUrl[newUrl.length - 1] 
      const p2 = newUrl[newUrl.length - 2]

      newUrl[newUrl.length - 1] = p2
      newUrl[newUrl.length - 2] = p1
      
      return { ...post, cover: newUrl.join("/") };
  })

  return postsAndPhotos;
}
const generatePosts = (postsAndPhotos) => {
  postsAndPhotos.forEach(({ cover, title, body }) => {
    const postEl = document.createElement("div");
    postEl.className = "post";

    postEl.innerHTML = `
      <img src="${cover}" alt="${title}" />
      <div class="post-content">
        <h3>${title}</h3>
        <p>${body}</p>
      </div>
    `;

    responsesDivEl.appendChild(postEl);
  });
};

const form = document.getElementById("postForm");

const createPost = async (title, body, userId = 1) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        body,
        userId
      })
    });

    const data = await response.json();
    console.log('Post criado:', data);
    return data;
  } catch (error) {
    console.error('Erro ao criar post:', error);
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;

  const createdPost = await createPost(title, body);
  alert("Post criado com ID: " + createdPost.id);
});


(async () => {
  const postsAndPhotos = await fetchPosts();
  generatePosts(postsAndPhotos)
})();

