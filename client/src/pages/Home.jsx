import React, { useState, useEffect } from "react";
import { Card, FormField, Loader } from "../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => {
      return (
        <Card
          key={post._id}
          // title={post.title}
          // description={post.description}
          // image={post.image}
          {...post}
        />
      );
    });
  }
  return (
    <h2 className="text-[#6449ff] mt-5 font-bold text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState(null);

  const [searchResult, setSearchResult] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/v1/posts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();

          setPosts(result.data.reverse());
        }
      } catch {
        alert(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const filteredPosts = posts.filter((post) => {
          return (
            post.name.toLowerCase().includes(searchText.toLowerCase()) ||
            post.prompt.toLowerCase().includes(searchText.toLowerCase())
          );
        });

        setSearchResult(filteredPosts);
      }, 500)
    );
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="text-[32px] font-extrabold text-[#222328]">Home</h1>
        <p className="text-[14px] text-[#666e75] mt-2 max-w-[500px]">
          Welcome to Imagen-A-I
        </p>
      </div>
      <div className="mt-16">
        <FormField
          label={"Search Posts"}
          type="text"
          name={"text"}
          placeholder="Search posts you find amusing"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing results for{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchResult}
                  title="No search results found"
                />
              ) : (
                <RenderCards data={posts} title="No posts found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
