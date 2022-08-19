import Icon from "components/atoms/Icon/icon";
import { StaticImageData } from "next/image";

const REPOLISTLIMIT = 5;

interface RepoList {
  repoName: string;
  repoIcon: StaticImageData;
}

interface CardRepoListProps {
  repoList: RepoList[];
}

const CardRepoList = ({ repoList }: CardRepoListProps): JSX.Element => {
  return (
    <div className="flex gap-2 items-center font-medium text-xs text-light-slate-11">
      {
        repoList.length > 0 ?
          <>
            {
              repoList
                .filter((repo, arrCount) => arrCount < REPOLISTLIMIT)
                .map(({repoName, repoIcon}, index) => 
                  <div key={index} className="flex gap-1 p-1 pr-2 border-[1px] border-light-slate-6 rounded-lg text-light-slate-12">
                    <Icon IconImage={repoIcon} />
                    {repoName}
                  </div>
                )
            }
            <div>
              {repoList.length > REPOLISTLIMIT - 1 ? `+${repoList.length - REPOLISTLIMIT}` : null}
            </div>
          </>

          :

          <>
            No contributions currently...
          </>
      }
    </div>
  );
};

export default CardRepoList;