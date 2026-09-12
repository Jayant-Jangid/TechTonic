# SIH 2026 Submission Guide

## Recommended structure

```text
YOUR-SIH-PROJECT/
├── README.md
├── SUBMISSION_GUIDE.md
├── requirements.txt
├── .gitignore
├── LICENSE
├── submission/
│   ├── PRESENTATION.md
│   └── DEMO.md
├── src/
│   ├── main.py
│   ├── server.py
│   ├── db.py
│   ├── setup_mysql.py
│   ├── mysql_schema.sql
│   ├── kisansetu.db
│   ├── index.html
│   ├── css/
│   └── js/
├── docs/
│   └── architecture.md
├── assets/
│   └── screenshots/
│       └── README.md
└── data/
    ├── msp_mandi_variation_2025_2026.csv
    ├── seasonal_crop_arrivals_realization.csv
    └── enam_mandis_trade_by_state.csv
```

## Presentation

Upload the final PPT/PPTX to the `submission/` folder when the file size is suitable for GitHub. Use a clear filename such as:

`TeamName_SIH2026_Presentation.pptx`

If the PPT is too large, use Google Drive or OneDrive and put the shareable viewer link in `submission/PRESENTATION.md`.

## Demo video

The demo video is optional. If you have one, add its YouTube/Google Drive link to `submission/DEMO.md` and make sure it is accessible without requesting permission.

## Screenshots / hardware photos

Put important screenshots and prototype photos in `assets/screenshots/`. Include the most useful screens/results rather than random development screenshots.

## Do not upload

- Passwords
- API keys
- Access tokens
- `.env` files containing secrets
- Private credentials
- Other confidential information

## README should answer

1. What problem are you solving?
2. What is your proposed solution?
3. How does it work?
4. Which technologies did you use?
5. How can a reviewer run it?
6. What does the final output look like?
7. What are the important features and expected impact?

## Before submission

Open your repository in a private/incognito browser window or while logged out and verify that the reviewer can access the code, PPT, screenshots, documentation and any submitted links that are supposed to be public.
