# 솔루션링크 이메일 비서 (Solution-Link Email Assistant)

솔루션링크 이메일 비서는 AI를 활용하여 복잡하고 번거로운 업무용 이메일 작성을 돕는 웹 애플리케이션입니다. 휴가 신청, 출장 보고, 업무 보고 등 다양한 상황에 맞는 템플릿을 제공하여, 사용자가 몇 번의 클릭만으로 전문적인 형식의 이메일을 쉽고 빠르게 생성할 수 있도록 지원합니다.

## ✨ 주요 기능

- **🤖 AI 기반 이메일 자동 생성**: Google Gemini AI 모델을 연동하여 입력된 정보에 따라 자연스러운 이메일 제목과 본문을 생성합니다.
- **📋 다양한 템플릿 제공**:
  - 연차/반차 신청
  - 출장/파견 신청
  - 업무/주간 보고
  - 휴일 근무 신청
- **🧑‍💼 사용자 정보 저장**: 사용자의 이름, 부서, 직책 등 정보를 로컬에 저장하여 매번 다시 입력할 필요가 없습니다.
- **👥 간편한 수신자 선택**: 직급과 이름을 포함한 수신자 정보를 손쉽게 추가하고 관리할 수 있습니다.
- **🌍 다국어 제목 번역**: 생성된 이메일 제목을 영어, 일본어, 중국어로 번역하는 기능을 제공합니다.
- **📬 바로 사용 가능한 HTML 형식**: 생성된 이메일은 Gmail 등 이메일 클라이언트에 바로 붙여넣어 사용할 수 있는 HTML 형식으로 제공됩니다.
- **📋 클립보드 복사**: 버튼 클릭 한 번으로 이메일 제목과 본문을 복사할 수 있습니다.
- **📱 반응형 UI**: 데스크톱과 모바일 환경 모두에서 편리하게 사용할 수 있습니다.

## 🛠️ 사용 기술

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **AI**: Google Gemini
- **Libraries**: date-fns, lucide-react, sonner

## 🚀 로컬에서 실행하기

이 프로젝트를 로컬 환경에서 실행하려면 Node.js와 npm이 설치되어 있어야 합니다.

```sh
# 1. 이 저장소를 클론합니다.
git clone <YOUR_GIT_URL>

# 2. 프로젝트 디렉터리로 이동합니다.
cd sol-link-email-assistant/template-scribe-mail

# 3. 의존성을 설치합니다.
npm install

# 4. 개발 서버를 시작합니다.
npm run dev
```

이제 브라우저에서 `http://localhost:5173` (또는 터미널에 표시된 다른 주소)으로 접속하여 애플리케이션을 확인할 수 있습니다.

## Project info

**URL**: https://lovable.dev/projects/2408284b-ad2f-472f-ab42-5fac6a9e7429

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2408284b-ad2f-472f-ab42-5fac6a9e7429) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2408284b-ad2f-472f-ab42-5fac6a9e7429) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
