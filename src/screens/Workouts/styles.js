import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  workoutInner: {
    flex: 1,
  },
  historyIntro: {
    marginBottom: 15,
    paddingRight: 20,
  },
  historyDescription: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 21,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  backButtonContainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 10,
  },
  backLink: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  cardSub: {
    color: colors.muted,
    fontSize: 12,
  },
  cardArrow: {
    color: colors.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 32,
    color: colors.background,
    fontWeight: '600',
  },
  outlineBtn: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: colors.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 15,
    borderRadius: 12,
  },
  inputSmall: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 15,
    borderRadius: 12,
    width: 75,
    marginRight: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontWeight: '600',
    color: colors.background,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  setText: {
    color: colors.muted,
    fontWeight: '600',
  },
  setVal: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  removeText: {
    color: colors.error,
    fontSize: 10,
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  modalRow: {
    paddingHorizontal: 20,
  },
  modalInput: {
    flex: 1,
  },
  dbList: {
    paddingHorizontal: 20,
  },
  dbItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#4a445f',
  },
  dbItemText: {
    color: colors.text,
    fontSize: 16,
  },
  addSmall: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSmallText: {
    fontWeight: '700',
    color: colors.background,
    fontSize: 18,
  },
  closeBtn: {
    backgroundColor: '#2f2a40',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    margin: 20,
  },
  closeBtnText: {
    color: colors.text,
    fontWeight: '700',
  },
});

export default styles;
