import { Icon } from "@iconify/react";

function AboutPage() {
  return (
    <div className="m-10">
      <div>
        devtools of
        <a
          href="https://github.com/lovetingyuan/react-atomic-store"
          target="_blank"
          className="mx-1 link"
        >
          react-atomic-store
          <Icon
            icon="material-symbols-light:open-in-new"
            className="inline-block ml-1"
          ></Icon>
        </a>
      </div>
      <div className="text-sm my-8">
        <Icon
          icon="material-symbols-light:bookmark-heart"
          className="inline mr-1 text-red-500"
          width={20}
        ></Icon>
        <code>Build with React, daisyUI, Hono, Vite.</code>
      </div>
    </div>
  );
}
export default AboutPage;
