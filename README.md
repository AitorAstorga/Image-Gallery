[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/AitorAstorga/Image-Gallery">
    <img src="src/assets/rngLogo.png" alt="Logo" width="160" height="160">
  </a>

  <h1 align="center">[ARCHIVED] Image Gallery</h1>

  <p align="center">
    Simple HTML / CSS / JS image gallery made for my cat and deployed with Docker.
    <br />
    <br />
    <a href="https://michi.blue">View Demo</a>
    ·
    <a href="https://github.com/AitorAstorga/Image-Gallery/issues">Report Bug or </a>
    ·
    <a href="https://github.com/AitorAstorga/Image-Gallery/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#serve">Serve</a>
    </li>
    <li>
      <a href="#build">Build</a>
      <ul>
        <li><a href="#dockerfile">Dockerfile</a></li>
        <li><a href="#generate_images_jsonsh">generate_images_json.sh</a></li>
        <li><a href="#github-actions-workflow">GitHub Actions Workflow</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

> [!WARNING]
> This project is now migrated to https://github.com/AitorAstorga/image_gallery as part of my new efforts to erase JavaScript from the Earth. Glory to [WebAssembly](https://webassembly.org/) compiled by the grace of the all-powerful [Rust](https://www.rust-lang.org)!

<!-- ABOUT THE PROJECT -->
## About The Project

This project is an image gallery application that dynamically generates a JSON list of images from a specified directory. It uses Nginx to serve the content and monitors the images directory for any changes, updating the JSON file accordingly. The application is containerized using Docker and integrated with GitHub Actions for continuous integration and deployment.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

This project is built with the following technologies:

- [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=fff)](#)
- ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
- [![Bash](https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnubash&logoColor=fff)](#)
- [![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](#)
- [![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=vsc&logoColor=white)](#)


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- Docker installed on your local machine
- Git installed on your local machine
- A GitHub account with repository access

### Installation

1. Clone the repository to your local machine using the following command: `git clone https://github.com/AitorAstorga/Image-Gallery.git`
2. Navigate to the project directory: `cd Image-Gallery`
3. Ensure that Docker is installed and running on your machine.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Serve
To use this project with your own GitHub repository, you need to clone the repo, change the `docker-image.yml`, and configure your GitHub fork with a secret token:

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine: `git clone https://github.com/yourusername/your-forked-repo.git`
3. Navigate to the project directory: `cd your-forked-repo`
4. Make any required changes to the project.
5. In your GitHub repository, go to Settings > Secrets and Variables > Actions.
6. Add a new secret named `GHCR_TOKEN` using a token generated from [GitHub Tokens](https://github.com/settings/tokens).

> [!NOTE]
> Replace my name in `docker-image.yml` like so:
```
# Build the Docker image
- name: Build the Docker image
    run: docker build . --file Dockerfile --tag aichan-image-gallery:latest --tag ghcr.io/your_username/aichan-image-gallery:latest

# Push the Docker image to GHCR
- name: Push Docker images to GHCR
    run: |
    # Push the main app image
    docker push ghcr.io/your_username/aichan-image-gallery:latest
```

Example to serve the application using Docker:

1. Build the Docker image with the following command: `docker build -t aichan-image-gallery:latest .`
2. Run the Docker container: `docker run -d -p 80:80 aichan-image-gallery:latest`
3. Access the application by navigating to `http://localhost` in your web browser.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Build

The project uses GitHub Actions to automate the building and pushing of Docker images. The workflow is defined in the `.github/workflows/docker-image.yml` file. On every push or pull request to the main branch, the workflow performs the following steps:

1. Checks out the repository code.
2. Logs in to the GitHub Container Registry using a secret token.
3. Builds the Docker image with the tags `aichan-image-gallery:latest` and `ghcr.io/aitorastorga/aichan-image-gallery:latest`.
4. Pushes the Docker images to the GitHub Container Registry.

### Dockerfile
The Dockerfile sets up an Nginx server to serve the image gallery. It performs the following actions:

- Uses the latest Nginx image as the base.
- Installs `inotify-tools` to monitor directory changes.
- Removes the existing HTML directory in Nginx.
- Copies the project repository into the Nginx HTML directory.
- Adds the `generate_images_json.sh` script to the container and makes it executable.
- Creates a custom entrypoint script that runs the JSON generation script in the background and starts Nginx.
- Exposes port 80 for the Nginx server.


### generate_images_json.sh
This Bash script generates a JSON file listing all image files in the `images` directory. It performs the following functions:

- Scans the `images` directory for files with extensions `.jpg`, `.jpeg`, `.png`, and `.gif`.
- Creates or updates the `images.json` file with the list of image filenames.
- Uses `inotifywait` to monitor the `images` directory for any creation, deletion, or movement of image files and regenerates the JSON file upon detecting such events.

### GitHub Actions Workflow
The GitHub Actions workflow defined in `.github/workflows/docker-image.yml` automates the continuous integration process by:

- Triggering on pushes and pull requests to the main branch.
- Checking out the repository code.
- Logging into the GitHub Container Registry using a secure token.
- Building the Docker image with appropriate tags.
- Pushing the Docker image to the GitHub Container Registry for deployment.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the European Union Public License v1.2. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Aitor Astorga Saez de Vicuña - a.astorga.sdv@protonmail.com

Project Link: [https://github.com/AitorAstorga/Image-Gallery](https://github.com/AitorAstorga/Image-Gallery)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Thanks to these nice projects!

* [Img Shields](https://shields.io)
* [markdown-badges](https://github.com/Ileriayo/markdown-badges#table-of-contents)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/AitorAstorga/Image-Gallery.svg?style=for-the-badge
[contributors-url]: https://github.com/AitorAstorga/Image-Gallery/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/AitorAstorga/Image-Gallery.svg?style=for-the-badge
[forks-url]: https://github.com/AitorAstorga/Image-Gallery/network/members
[stars-shield]: https://img.shields.io/github/stars/AitorAstorga/Image-Gallery.svg?style=for-the-badge
[stars-url]: https://github.com/AitorAstorga/Image-Gallery/stargazers
[issues-shield]: https://img.shields.io/github/issues/AitorAstorga/Image-Gallery.svg?style=for-the-badge
[issues-url]: https://github.com/AitorAstorga/Image-Gallery/issues
[license-shield]: https://img.shields.io/github/license/AitorAstorga/Image-Gallery.svg?style=for-the-badge
[license-url]: https://github.com/AitorAstorga/Image-Gallery/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/aitor-astorga-saez-de-vicuña
