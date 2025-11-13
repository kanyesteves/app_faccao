<template>
  <div class="login-container">
    <Card class="login-card">
      <template #content>
        <h2 class="subtitle">Bem vindo</h2>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="field">
            <InputText
              id="email"
              v-model="email"
              type="email"
              placeholder="Email"
              class="w-full"
              required
            />
          </div>

          <div class="field">
            <Password
              id="password"
              v-model="password"
              placeholder="Senha"
              :feedback="false"
              toggleMask
              class="w-full"
              inputClass="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            label="Entrar"
            class="w-full"
            severity="help"
          />

          <div class="text-center mt-3">
            <a href="#" @click.prevent="handleRegister" class="register-link">
              Quero me registrar
            </a>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

export default defineComponent({
  name: 'LoginView',
  components: {
    Card,
    InputText,
    Password,
    Button
  },
  setup() {
    const email = ref('');
    const password = ref('');

    const handleLogin = () => {
      console.log('Login:', email.value, password.value);
      // Lógica de autenticação será implementada aqui
    };

    const handleRegister = () => {
      console.log('Ir para registro');
      // Navegação para tela de registro será implementada aqui
    };

    return {
      email,
      password,
      handleLogin,
      handleRegister
    };
  }
});
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f4f5ff 0%, #2f1c6a 100%);
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-card :deep(.p-card-content) {
  padding: 2rem 1.5rem;
}

.subtitle {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2f1c6a;
  margin-bottom: 2rem;
}

.login-form .field {
  margin-bottom: 1.5rem;
}

.login-form .field :deep(.p-inputtext),
.login-form .field :deep(.p-password) {
  width: 100%;
}

.login-form .field :deep(.p-password-input) {
  width: 100%;
}

.login-form :deep(.p-button) {
  padding: 0.85rem 1rem;
  font-size: 1.1rem;
}

.text-center {
  margin-top: 2rem;
}

.register-link {
  color: #2f1c6a;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #1f1347;
  text-decoration: underline;
}

/* Responsividade */
@media (min-width: 640px) {
  .login-card :deep(.p-card-content) {
    padding: 3rem 2.5rem;
  }

  .subtitle {
    font-size: 1.8rem;
  }
}
</style>
