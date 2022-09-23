import React, { useEffect, useState } from "react";
import { WithPageLayout } from "../interfaces/with-page-layout";
import LoginLayout from "layouts/login";
import { useRouter } from "next/router";
import Card from "components/atoms/Card/card";
import ProgressPie from "components/atoms/ProgressPie/progress-pie";
import Title from "components/atoms/Typography/title";
import Text from "components/atoms/Typography/text";
import Icon from "components/atoms/Icon/icon";
import CompletedIcon from "public/icons/completed-icon.svg";
import GitHubAuthActiveIcon from "public/icons/github-auth-active-icon.svg";
import ChooseRepoIcon from "public/icons/choose-repo-icon.svg";
import ChooseRepoActiveIcon from "public/icons/choose-repo-active-icon.svg";
import PATIcon from "public/icons/pat-icon.svg";
import PATActiveIcon from "public/icons/pat-active-icon.svg";
import HighlightIcon from "public/icons/highlight-icon.svg";
import GitHubIcon from "public/icons/github-icon.svg";
import AddIcon from "public/icons/add-icon.svg";
import Button from "components/atoms/Button/button";
import TextInput from "components/atoms/TextInput/text-input";
import { LoginRepoObjectInterface } from "interfaces/login-repo-object-interface";
import useLoginRepoList from "lib/hooks/useLoginRepoList";
import { captureAnayltics } from "lib/utils/analytics";
import useSupabaseAuth from "lib/hooks/useSupabaseAuth";
import { User } from "@supabase/supabase-js";
import { useGlobalStateContext } from "context/global-state";
import { getAvatarLink } from "lib/utils/github";
import useOnboarded from "lib/hooks/useOnboarded";

type handleLoginStep = () => void;

interface LoginStep1Props {
  handleLoginStep: handleLoginStep;
  user: User | null;
}

const LoginStep1: React.FC<LoginStep1Props> = ({ handleLoginStep, user }) => {
  captureAnayltics("User Onboarding", "onboardingStep1", "visited");

  const router = useRouter();
  const { onboarded } = useOnboarded();

  useEffect(() => {
    if (onboarded) {
      router.push("/");
    } else if (onboarded === false && user) {
      handleLoginStep();
    }
  }, [handleLoginStep, router, user, onboarded]);

  const handleGitHubAuth = async() => {
    // Redirect user to GitHub to authenticate
    // await auth.signIn({ provider: 'github' }, {
    //   redirectTo: process.env.NEXT_PUBLIC_ONBOARDING_CALLBACK_URL ?? '/'
    // });
    
    /**
      * Starting on Step 2 because they've already authenticated
      * via GitHub before starting onboarding. Will revisit
      * after initial landing page is in place.
    */    
    handleLoginStep();
  };

  return (
    <>
      <div className="login-step flex flex-col lg:h-full gap-20">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon className="lg:hidden" IconImage={GitHubAuthActiveIcon} size={48} />
            <Title className="!text-sm !text-light-orange-9">Step One</Title>
          </div>
          <div className="gap-2 mb-4">
            <Title className="!text-2xl">Authenticate with GitHub</Title>
          </div>
          <div className="mb-4 text-left ">
            <Text className="!text-sm">Before we start indexing open-source projects with OpenSauced, we will need you to authenticate with your GitHub account:</Text>
          </div>
          <div className="flex gap-2 items-start mb-4">
            <Icon IconImage={HighlightIcon} />
            <Text className="!text-[16px] !font-medium !text-light-slate-12">We will not have access to your private repos.</Text>
          </div>
          <div className="flex gap-2 items-start mb-4">
            <Icon IconImage={HighlightIcon} />
            <Text className="!text-[16px] !font-medium !text-light-slate-12">We will not spam you with emails.</Text>
          </div>
        </div>
        <div>
          <Button onClick={handleGitHubAuth} type="primary" className="w-full h-10">Authenticate <Icon IconImage={GitHubIcon} className="ml-2"/></Button>
        </div>
      </div>
    </>
  );
};

interface LoginStep2Props {
  handleLoginStep: handleLoginStep;
}

const LoginStep2: React.FC<LoginStep2Props> = ({ handleLoginStep }) => {
  const { sessionToken } = useSupabaseAuth();
  const { setAppState } = useGlobalStateContext();

  captureAnayltics("User Onboarding", "onboardingStep2", "visited");

  // Mark the user as onboarded
  const onboardUser = async() => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/onboarding`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${sessionToken}`
        }
      });
      setAppState({ onboarded: true });
    } catch (e) {
      // handle error
    }
  };

  // Validate PAT
  const [token, setToken] = useState("");
  const handleAddPAT = async() => {
    try {
      await onboardUser();

      // Validate PAT and onboard user
      if (token) {
        // await fetch("/api/onboarding", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     token
        //   })
        // });
      }
      
      // If valid, go to next step
      handleLoginStep();
    } catch (e) {
      // If invalid, display error
      console.error(e);
    }
  };

  return (
    <>
      <div className="login-step flex flex-col h-full gap-1">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon className="lg:hidden" IconImage={PATActiveIcon} size={48} />
            <Title className="!text-sm !text-light-orange-9">Step Two</Title>
          </div>
          <div className="gap-2 mb-4">
            <Title className="!text-2xl">Provide your token</Title>
          </div>
          <div className="mb-4 text-left ">
            <Text className="!text-sm">In order to provide fresh, and insightful data, we’ll need a favor: a GitHub personal access token to fetch public GitHub data. Here’s how we’re going to use your token:</Text>
          </div>
          <div className="flex gap-2 items-start mb-4">
            <Icon IconImage={HighlightIcon} />
            <Text className="!text-[16px] !font-medium !text-light-slate-12">Index insights from git data</Text>
          </div>
          <div className="flex gap-2 items-start mb-4">
            <Icon IconImage={HighlightIcon} />
            <div className="w-[calc(362px-24px)]">
              <Text className="!text-[16px] !font-medium !text-light-slate-12">Fetch basic GitHub information from Pull Requests and Issues</Text>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <TextInput placeholder="Insert Your Token Here" onChange={(e) => setToken(e.target.value)}/>
          <Button onClick={handleAddPAT} type="primary" className="w-full h-10">Confirm Token</Button>
        </div>
      </div>
    </>
  );
};

interface LoginStep3Props {
  handleLoginStep: handleLoginStep;
  checkFollowed: {
    isClickedFollowed: boolean;
    setIsClickedFollowed: React.Dispatch<React.SetStateAction<boolean>>;
  }
  repoList: LoginRepoObjectInterface[];
}

const LoginStep3: React.FC<LoginStep3Props> = ({ repoList, handleLoginStep, checkFollowed }) => {
  captureAnayltics("User Onboarding", "onboardingStep3", "visited");
  const router = useRouter();

  const [isFollowing, setIsFollowing] = useState<boolean[]>(repoList.map(() => false));

  const handleSkipAddRepo = () => {
    handleLoginStep();
    router.push("/hacktoberfest");
  };

  const handleFollowRepo = (index: number) => {
    if(!isFollowing[index]) {
      setIsFollowing(prevState => {
        const newState = [...prevState];
        newState[index] = !newState[index];
        return newState;
      });
      checkFollowed.setIsClickedFollowed(true);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full gap-5">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon className="lg:hidden" IconImage={ChooseRepoActiveIcon} size={48} />
            <Title className="!text-sm !text-light-orange-9">Step Three</Title>
          </div>
          <div className="gap-2 mb-4">
            <Title className="!text-2xl">Follow some Repositories</Title>
          </div>
          <div className="mb-4 text-left ">
            <Text className="!text-sm">We’ll provide insights on the repos you choose to follow. You can follow up to 10 repos.</Text>
          </div>
          <div className="max-h-[250px] lg:h-[165px] overflow-y-auto">
            {
              repoList.map((repo, index) => {
                return (
                  <div key={index} className="flex justify-between w-full border-[1px] rounded-lg border-light-slate-6 p-2 mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        alt="Repo Icon"
                        className="h-4 w-4 rounded-md overflow-hidden"
                        src={getAvatarLink(repo.repoOwner)}
                      />
                      <div>
                        <Text className="!text-[16px] !font-medium">{`${repo.repoOwner}/`}</Text>
                        <Text className="!text-[16px] !font-medium !text-light-slate-12">{`${repo.repoName}`}</Text>
                      </div>
                    </div>
                    <Button onClick={() => handleFollowRepo(index)} type={isFollowing[index] ? "outline" : "default"}>
                      {
                        isFollowing[index] ? "Following" :
                          <>
                            Follow  <Icon IconImage={AddIcon} size={8} className="ml-2"/>
                          </>
                      }
                    </Button>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div onClick={handleSkipAddRepo} className="flex justify-center gap-2">
          <Title className="!text-sm font-semibold !text-light-orange-9 cursor-pointer">{checkFollowed.isClickedFollowed ? "Continue" : "Skip this step"}</Title>
        </div>
      </div>
    </>
  );
};

const Login: WithPageLayout = () => {
  type LoginSteps = number;

  const { user } = useSupabaseAuth();
  const repoList = useLoginRepoList();

  const highlighted = "!text-light-slate-12";

  const [ currentLoginStep, setCurrentLoginStep ] = useState<LoginSteps>(1);
  const [ isClickedFollowed, setIsClickedFollowed ] = useState<boolean>(false);

  const checkFollowed = { isClickedFollowed, setIsClickedFollowed };

  // check if user is authenticated

  // Enter PAT
  // Validate PAT
  // Continue

  // Optionally Select repos

  // Go to homepage

  const handleLoginStep = async () => {
    setCurrentLoginStep(prevStep => prevStep + 1);
  };

  return (
    <Card className="flex flex-col lg:flex-row w-[870px] h-[436px] !p-0 rounded-none lg:rounded-lg !bg-inherit lg:!bg-light-slate-2 lg:shadow-login !border-0 lg:!border-[1px] lg:!border-orange-500">
      <>
        <section className="w-full lg:h-full p-6 lg:p-9">
          <div className="flex gap-2 mb-6">
            <ProgressPie percentage={currentLoginStep === 1 ? 0 :  currentLoginStep === 2 ? 33 : currentLoginStep === 3 && !isClickedFollowed ? 66 : 100} />
            <Title className="!text-2xl">Let&apos;s get started</Title>
          </div>
          <div className="mb-8">
            <Text className="!text-sm">Open Sauced is a platform to provide insights on open source contributions. </Text>
          </div>
          <div className="hidden lg:flex gap-2 items-center mb-8">
            <Icon IconImage={currentLoginStep === 1 ? GitHubAuthActiveIcon : CompletedIcon} size={48} />
            <Text disabled={currentLoginStep !== 1} className={`!text-[16px] !font-medium ${currentLoginStep === 1 && highlighted}`}>Authenicate with GitHub</Text>
          </div>
          <div className="hidden lg:flex gap-2 items-center mb-8">
            <Icon IconImage={currentLoginStep === 2 ? PATActiveIcon : currentLoginStep < 2 ? PATIcon : CompletedIcon} size={48} />
            <Text disabled={currentLoginStep !== 2} className={`!text-[16px] !font-medium ${currentLoginStep === 2 && highlighted}`}>Provide a Personal Access Token</Text>
          </div>
          <div className="hidden lg:flex gap-2 items-center mb-8">
            <Icon IconImage={currentLoginStep === 3 && !isClickedFollowed ? ChooseRepoActiveIcon : currentLoginStep < 3 ? ChooseRepoIcon : CompletedIcon} size={48} />
            <Text disabled={currentLoginStep !== 3} className={`!text-[16px] !font-medium ${currentLoginStep === 3 && highlighted}`}>Choose some repositories</Text>
          </div>
        </section>
        <section className="w-full lg:h-full p-9 rounded-lg lg:rounded-r-lg bg-white">
          {currentLoginStep === 1 && <LoginStep1 handleLoginStep={handleLoginStep} user={user}/>}
          {currentLoginStep === 2 && <LoginStep2 handleLoginStep={handleLoginStep}/>}
          {currentLoginStep >= 3 && <LoginStep3 handleLoginStep={handleLoginStep} repoList={repoList} checkFollowed={checkFollowed}/>}
        </section>
      </>
    </Card>
  );
};

Login.PageLayout = LoginLayout;

export default Login;