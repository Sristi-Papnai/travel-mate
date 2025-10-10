import type { Question } from "@/interfaces/openapi";


export const questions: Question[] = [
    {
      title: "Let's get Started",
      fields: [
        {
          label: "Where are you planning to go?",
          key: "destination",
          type: "text",
          required: true, 
        },
        {
          label: "Add Description",
          key: "description",
          type: "text",
        },
      ],
    },
    {
      title: "Plan Dates",
      fields: [
        {
          label: "Travel Date (Start)",
          key: "start_date",
          type: "date",
        },
        {
          label: "Travel Date (End)",
          key: "end_date",
          type: "date",
        },
      ],
    },
    {
      title: "Decide Budget",
      fields: [
        {
          label: "Min Budget",
          key: "min_budget",
          type: "number",
        },
        {
          label: "Max Budget",
          key: "max_budget",
          type: "number",
        },
      ],
    },
    {
      title: "Finalize with Few More details",
      fields: [
        {
          label: "Occasion",
          key: "occasion",
          type: "select",   // changed to select
          required: true, 
          options: ["Business", "Leisure"], // add options
        },
  
        {
          label: "No of people?",
          key: "members",
          type: "number",
        },
      ],
    },
  ];

  export const tripStatus = [
    "inplanning",
    "confirmed",
    "completed",
    "cancelled"
  ]
  