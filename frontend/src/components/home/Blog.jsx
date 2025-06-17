import React from "react";

const Blog = () => {
  return (
    <div className="mt-5 md:mt-14 montserrat px-2 md:px-0 container mx-auto">
      <img src="/images/icons/blog.svg" className="w-full md:block hidden" />
      <p className="marcellus text-center text-4xl text-[#1C5540] block md:hidden">
        BLOG
      </p>
      <div className="mt-3 md:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="border border-[#CED4DA] rounded-2xl">
          <img
            src="/images/icons/blog-img.png"
            className="w-full rounded-t-2xl"
          />
          <div className="p-5 text-[#232323]">
            <p className="font-semibold text-xl text-center">
              There’s going after top talent, and then there’s going after top
              talent within highly-competitive industries
            </p>
            <p className="mt-2 text-center line-clamp-4">
              So, what does this approach look like exactly? What is it that
              recruiters need to do to grab the attention of the cream of the
              industry crop? We happen to help recruitment tthey do it?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
