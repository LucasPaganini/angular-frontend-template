# Contributing to the code base

## Repository Guidelines

### Working from a fork

Developers will never push directly to the main repository. Each developer will maintain their own fork of the repository and submit Pull Requests to the main repository, so that incoming changes can be tested and approved before they are integrated.

### Main branches

- `dev` -- the latest development version.
  - The code on this branch must always be functional.
  - GitHub actions will automatically deploy alpha builds from this branch.
- `master` -- the latest General Availability release.
  - Only the maintainer merges `dev` into master.
  - All translations must be done for a production build to pass.
  - If a major bug requires immediate triage, a new `hotfix/{issue}` may branch off `master`.
    In this case, the `hotfix` branch must be merged into `master` **and** `dev` when it is complete.

### Branch conventions

Before starting any work, **make sure there is a GitHub issue** describing what will be done. If one does not exist, create one. Assign yourself to the relevant issue and label it as `"in progress"`.

Using the issue number, create a new branch **based off the main `dev` branch** using the following naming conventions:

- `fix/{issue}` for bug fixes
- `hotfix/{issue}` for urgent issues targetting `master`
- `feature/{issue}` for new features

Once your work is done and [conforms with our style conventions](#style-conventions):

1. Create a pull request (PR) to merge your branch from your fork into the `dev` branch of the main repository
2. Link the issue to the PR by adding `Addresses #<issue>` to the comment (e.g. `Addresses #1810`)
   - Note that certain magic phrases (like `Fixes #<issue>`) will automatically close issues. Don't do that.
3. Add the `"to verify"` label to the issue
4. Remove the `"in progress"` label from the issue
5. Assign yourself as the responsible for the PR
6. Assign a reviewer for you work
7. Once all reviewers approve it, it can be merged by anyone with access
8. The person who filed the issue should verify that it's fixed and close it
9. Delete the merged branch from your fork

## Style conventions

We currently have two scripts relevant to our style conventions:

- `npm run lint`: Lints with [prettier](https://prettier.io/), and [eslint](https://eslint.org/). PRs to `dev` or `master` will fail if they can't pass this script.
- `npm run format`: Automatically fixes some conventions.

Before pushing any code, make sure it conforms to our conventions.

For a full list of automated conventions, look at `.prettierrc` and `.eslint.js`.
Not all conventions are automatically fixed or verified, those are described below:

| What                      | Convention           |
| :------------------------ | :------------------- |
| File names                | Kebab case           |
| Styling preprocessor      | SCSS                 |
| Feature modules structure | Pages and components |

### File names, kebab case

All lowercase, use `-` for spaces and follow Angular conventions for dot separations.

Do:

- `app-routing.module.ts`
- `some-file.ts`
- `some-test.spec.ts`

Don't:

- `AppRouting.module.ts`
- `someFile.ts`
- `some-test.Spec.ts`

Exceptions:

- `Dockerfile`
- `README.md`
- `CONTRIBUTING.md`
- `CHANGELOG.md`

### Styling preprocessor, SCSS

Always use `.scss` for style files.

### Feature modules structure, pages and components

Every feature module should consist of a folder inside `src/app/` with the name
of the feature module. In that folder there should be 1 file (the feature
module) and 2 folders (`pages/` and `components/`).

The `pages/` folder has inner folders for each modularized page-level component
and a barrel `index.ts` exporting every page-level component. Those components
can depend on what's in `src/app/shared` and on the pure components of the
feature module.

The `components.` folder has inner folders for each modularized pure component
and a barrel `index.ts` exporting every pure component. Those components can
only depend on what's in `src/app/shared`.

The feature module can only depend on the page-level components.

Do:

```
courses
  ├─ courses.module.ts
  ├─ pages
  │  ├─ index.ts
  │  └─ courses-page
  │     ├─ courses-page.component.ts
  │     ├─ courses-page.component.html
  │     ├─ courses-page.component.scss
  │     ├─ courses-page.module.ts
  │     └─ index.ts
  └─ components
     ├─ index.ts
     └─ course-card
        ├─ course-card.component.ts
        ├─ course-card.component.html
        ├─ course-card.component.scss
        ├─ course-card.module.ts
        └─ index.ts
```
