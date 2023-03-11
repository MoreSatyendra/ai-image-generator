import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { getSurpriseMePrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const [generateImg, setGenerateImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatingImg = async () => {
    if (form.prompt) {
      try {
        setGenerateImg(true);
        const response = await fetch("http://localhost:8080/api/v1/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (error) {
        alert(error);
        console.log(error);
      } finally {
        setGenerateImg(false);
      }
    } else {
      alert("Please enter your prompt");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.prompt || !form.photo) {
      alert("Please fill in all the fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getSurpriseMePrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="text-[32px] font-extrabold text-[#222328]">Create</h1>
        <p className="text-[14px] text-[#666e75] mt-2 max-w-[500px]">
          Create your own post
        </p>
      </div>
      <form className="mt-16 max-w-3xl " onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          <FormField
            label="Name"
            placeholder="Enter your name"
            type="text"
            name="name"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            label="Prompt"
            placeholder="Enter your prompt"
            name="prompt"
            type="text"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          {/* <FormField
            label="Photo"
            placeholder="Enter your photo url"
            value={form.photo}
            onChange={(e) => setForm({ ...form, photo: e.target.value })}
          /> */}
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}
            {generateImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-5 mt-5">
          <button
            type="button"
            onClick={generatingImg}
            className="bg-green-500 text-white text-sm w-full sm:w-auto font-medium rounded-md py-3 px-6 text-center"
          >
            {generateImg ? "Generating..." : "Generate Image"}
          </button>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#666E75] text-[14px]">
            Once you have created the image you want, you can share it with
            others.
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
