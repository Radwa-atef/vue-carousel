<script>
  export default {
    name: "LeftIcon",
    props: {
      color: {
        type: String,
        required: false,
        default: "white",
      },
    },
  };
</script>
<template>
  <svg
    width="7" height="12"
    viewBox="0 0 7 12" fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 11L1 6L6 1" :stroke="color"
      stroke-width="1.67" stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
