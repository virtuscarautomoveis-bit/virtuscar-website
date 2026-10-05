const VirtusCarProgress = {

    getProgress() {
        const saved = localStorage.getItem("virtuscar_progress");

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                console.error("Erro ao carregar progresso:", error);
            }
        }

        return {
            aulas: {
                "aula-01": false,
                "aula-02": false,
                "aula-03": false,
                "aula-04": false
            },
            teste01: {
                concluido: false,
                nota: 0,
                aprovado: false
            }
        };
    },

    saveProgress(progress) {
        localStorage.setItem(
            "virtuscar_progress",
            JSON.stringify(progress)
        );
    },

    concluirAula(aula) {
        const progress = this.getProgress();

        if (progress.aulas[aula] !== undefined) {
            progress.aulas[aula] = true;
            this.saveProgress(progress);
        }
    },

    aulaConcluida(aula) {
        const progress = this.getProgress();

        return progress.aulas[aula] === true;
    },

    podeAbrirAula(aula) {

        const progress = this.getProgress();

        switch (aula) {

            case "aula-01":
                return true;

            case "aula-02":
                return progress.aulas["aula-01"] === true;

            case "aula-03":
                return progress.aulas["aula-02"] === true;

            case "aula-04":
                return progress.aulas["aula-03"] === true;

            default:
                return false;
        }
    },

    podeAbrirTeste01() {
        const progress = this.getProgress();

        return (
            progress.aulas["aula-01"] === true &&
            progress.aulas["aula-02"] === true &&
            progress.aulas["aula-03"] === true &&
            progress.aulas["aula-04"] === true
        );
    },

    guardarResultadoTeste01(nota) {

        const progress = this.getProgress();

        progress.teste01.nota = nota;
        progress.teste01.concluido = true;
        progress.teste01.aprovado = nota >= 80;

        this.saveProgress(progress);
    },

    teste01Aprovado() {
        const progress = this.getProgress();

        return progress.teste01.aprovado === true;
    },

    obterProgressoModulo01() {

        const progress = this.getProgress();

        let concluidas = 0;

        if (progress.aulas["aula-01"]) concluidas++;
        if (progress.aulas["aula-02"]) concluidas++;
        if (progress.aulas["aula-03"]) concluidas++;
        if (progress.aulas["aula-04"]) concluidas++;

        if (progress.teste01.aprovado) {
            concluidas++;
        }

        return {
            concluidas: concluidas,
            total: 5,
            percentagem: Math.round((concluidas / 5) * 100)
        };
    },

    modulo02Desbloqueado() {
        return this.teste01Aprovado();
    }

};
