async function loadArticle() {

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("post");

    if (!slug) {
        showError("No article was specified.");
        return;
    }

    try {

        // Get the article list
        const response = await fetch("posts/index.json");
        const data = await response.json();

        // Find the requested article
        const post = data.posts.find(item => item.slug === slug);

        if (!post) {
            showError("Article not found.");
            return;
        }

        // Get the article content
        const articleResponse = await fetch(post.file);
        const markdown = await articleResponse.text();

        // Display article information
        document.getElementById("post-title").textContent = post.title;
        document.getElementById("post-date").textContent = post.date;

        // Convert Markdown into HTML
        document.getElementById("post-content").innerHTML =
            marked.parse(markdown);

        // Update browser tab title
        document.title = post.title + " | My Website";

    } catch (error) {

        console.error("Article loading failed:", error);
        showError("Something went wrong while loading this article.");

    }
}


function showError(message) {

    const content = document.getElementById("post-content");

    if (content) {
        content.textContent = message;
    }

}


if (document.getElementById("post-content")) {
    loadArticle();
}
