<template>
  <div>
    <h2>Add New Serial</h2>
    <form>
      <div v-if="errors.length" class="alert alert-danger" role="alert">
        <div v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
          </ul>
        </div>
      </div>

      <div class="form-group">
        <label for="seriesTitle">Title</label>
        <input
          v-model="inputs.title"
          type="text"
          class="form-control"
          id="seriesTitle"
          :placeholder="placeholders.title"
        />
      </div>
      <div class="form-group">
        <div class="custom-file">
          <input
            type="file"
            @change="onFileSelected"
            class="custom-file-input"
            id="serialCoverImg"
            accept="image/*"
          />
          <label class="custom-file-label" for="serialCoverImg">{{ inputs.filename }}</label>
        </div>
      </div>
      <button @click.prevent="send" class="btn btn-primary float-right">Add Serial</button>
    </form>

    <img :src="previewImg" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      ongoing: true,
      errors: [],
      previewImg: null,
      inputs: {
        title: "",
        filename: "Upload Poster",
        image: null,
      },
      placeholders: {
        title: "Santa Barbara",
      },
    };
  },
  methods: {
    send() {
      if (this.validateForm()) {
        const serialData = {
          title: this.inputs.title,
          image: this.inputs.image,
        };
        this.$store.dispatch("addProduct", serialData);
        this.$router.push("/");
      }
    },
    onFileSelected(event) {
      const files = event.target.files;
      this.inputs.filename = files[0].name;
      if (this.inputs.filename.lastIndexOf(".") <= 0) {
        return alert("Please use a valid file!");
      }
      const fileReader = new FileReader();
      // Displays preview
      fileReader.addEventListener("load", () => {
        this.previewImg = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.inputs.image = files[0];
    },
    validateForm() {
      if (
        this.inputs.title &&
        this.inputs.image
      ) {
        return true;
      }

      this.errors = [];

      if (!this.inputs.title) {
        this.errors.push("Title required!");
      }
      if (!this.inputs.image) {
        this.errors.push("Poster image is required!");
      }
      return false;
    }
  }
};
</script>

<style scoped>
</style>
